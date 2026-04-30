-- Allow anyone to insert/delete videos and files (no admin gating)
DROP POLICY IF EXISTS "Admins can insert videos" ON public.uploaded_videos;
DROP POLICY IF EXISTS "Admins can delete videos" ON public.uploaded_videos;
DROP POLICY IF EXISTS "Admins can update videos" ON public.uploaded_videos;
CREATE POLICY "Anyone can insert videos" ON public.uploaded_videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete videos" ON public.uploaded_videos FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admins can insert files" ON public.uploaded_files;
DROP POLICY IF EXISTS "Admins can delete files" ON public.uploaded_files;
DROP POLICY IF EXISTS "Admins can update files" ON public.uploaded_files;
CREATE POLICY "Anyone can insert files" ON public.uploaded_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete files" ON public.uploaded_files FOR DELETE USING (true);

DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
CREATE POLICY "Anyone can insert blog posts" ON public.blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete blog posts" ON public.blog_posts FOR DELETE USING (true);

-- Storage: allow public uploads & deletes on 'uploads' bucket
DROP POLICY IF EXISTS "Admins can upload to uploads bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from uploads bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload to uploads bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete from uploads bucket" ON storage.objects;
CREATE POLICY "Public can upload to uploads bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Public can delete from uploads bucket" ON storage.objects FOR DELETE USING (bucket_id = 'uploads');