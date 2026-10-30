-- ============================================================
-- Reuse Before Return — Indexes for Performance
-- ============================================================

-- Products: most common queries
CREATE INDEX IF NOT EXISTS idx_products_owner_id ON products(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_city ON products(city);
CREATE INDEX IF NOT EXISTS idx_products_locality ON products(locality);
CREATE INDEX IF NOT EXISTS idx_products_listing_type ON products(listing_type);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_coords ON products(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Full-text search on title + description
CREATE INDEX IF NOT EXISTS idx_products_fts ON products USING gin(to_tsvector('english', title || ' ' || description));

-- Requests
CREATE INDEX IF NOT EXISTS idx_requests_product_id ON requests(product_id);
CREATE INDEX IF NOT EXISTS idx_requests_requester_id ON requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_requests_owner_id ON requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- Product images
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- Reports
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_target ON reports(target_type, target_id);

-- Email delivery logs
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_delivery_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_idempotency ON email_delivery_logs(idempotency_key);

-- Product alert subscriptions
CREATE INDEX IF NOT EXISTS idx_alerts_product_id ON product_alert_subscriptions(product_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON product_alert_subscriptions(user_id);
