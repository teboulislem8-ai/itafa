SELECT cron.schedule(
  'cleanup-expired-files',
  '0 */6 * * *',
  $$DELETE FROM uploaded_files WHERE expires_at < now()$$
);
