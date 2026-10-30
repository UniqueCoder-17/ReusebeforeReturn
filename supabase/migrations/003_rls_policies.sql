-- ============================================================
-- Reuse Before Return — Row Level Security Policies
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_alert_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_delivery_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Profiles: public read (non-sensitive fields only)" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: users can update own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- PRODUCTS (public read for active/non-draft, owner full access, admin full access)
CREATE POLICY "Products: public read active" ON products FOR SELECT
  USING (status != 'deleted' AND is_draft = false);
CREATE POLICY "Products: owner can read own" ON products FOR SELECT
  USING (auth.uid() = owner_id);
CREATE POLICY "Products: owner can insert" ON products FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Products: owner can update" ON products FOR UPDATE
  USING (auth.uid() = owner_id);
CREATE POLICY "Products: admin full access" ON products FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- PRODUCT IMAGES
CREATE POLICY "Images: public read" ON product_images FOR SELECT USING (true);
CREATE POLICY "Images: owner can insert" ON product_images FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM products WHERE id = product_id AND owner_id = auth.uid()));
CREATE POLICY "Images: owner can delete" ON product_images FOR DELETE
  USING (EXISTS (SELECT 1 FROM products WHERE id = product_id AND owner_id = auth.uid()));

-- REQUESTS
CREATE POLICY "Requests: requester or owner can read" ON requests FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = owner_id);
CREATE POLICY "Requests: authenticated can insert" ON requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Requests: owner can update status" ON requests FOR UPDATE
  USING (auth.uid() = owner_id OR auth.uid() = requester_id);
CREATE POLICY "Requests: admin full access" ON requests FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- FAVORITES
CREATE POLICY "Favorites: users can read own" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Favorites: users can insert own" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Favorites: users can delete own" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- CONVERSATIONS
CREATE POLICY "Conversations: participants can read" ON conversations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM requests WHERE id = request_id
    AND (requester_id = auth.uid() OR owner_id = auth.uid())
  ));

-- MESSAGES
CREATE POLICY "Messages: participants can read" ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversations c
    JOIN requests r ON r.id = c.request_id
    WHERE c.id = conversation_id
    AND (r.requester_id = auth.uid() OR r.owner_id = auth.uid())
  ));
CREATE POLICY "Messages: participants can insert" ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations c
      JOIN requests r ON r.id = c.request_id
      WHERE c.id = conversation_id
      AND (r.requester_id = auth.uid() OR r.owner_id = auth.uid())
    )
  );

-- NOTIFICATIONS
CREATE POLICY "Notifications: users can read own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Notifications: users can update own" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- REPORTS
CREATE POLICY "Reports: users can insert" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Reports: users can read own" ON reports FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Reports: admin full access" ON reports FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- MODERATION ACTIONS
CREATE POLICY "Moderation: admin only" ON moderation_actions FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- NOTIFICATION PREFERENCES
CREATE POLICY "NotifPrefs: users read own" ON notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "NotifPrefs: users update own" ON notification_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "NotifPrefs: users insert own" ON notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- PRODUCT ALERT SUBSCRIPTIONS
CREATE POLICY "Alerts: users read own" ON product_alert_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Alerts: users insert own" ON product_alert_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Alerts: users update own" ON product_alert_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Alerts: users delete own" ON product_alert_subscriptions FOR DELETE USING (auth.uid() = user_id);

-- SAVED SEARCHES
CREATE POLICY "SavedSearches: users read own" ON saved_searches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "SavedSearches: users insert own" ON saved_searches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "SavedSearches: users update own" ON saved_searches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "SavedSearches: users delete own" ON saved_searches FOR DELETE USING (auth.uid() = user_id);

-- EMAIL DELIVERY LOGS
CREATE POLICY "EmailLogs: users read own" ON email_delivery_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "EmailLogs: admin read all" ON email_delivery_logs FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
