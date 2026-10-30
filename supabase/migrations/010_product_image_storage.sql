-- Create or ensure the public product image bucket.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Only authenticated owners of a listing may upload into its image folder.
DROP POLICY IF EXISTS "Product images: owners can upload to owned listings" ON storage.objects;
CREATE POLICY "Product images: owners can upload to owned listings"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1
    FROM public.products
    WHERE products.id = (storage.foldername(name))[2]::uuid
      AND products.owner_id = auth.uid()
  )
);
