/**
 * Config for Today's Daily Battle. Supabase anon key is public by design; RLS protects data.
 * Admin is determined server-side only (Supabase app_metadata.role). Do not put admin email in client.
 */
window.TDB_CONFIG = {
  SUPABASE_URL: 'https://rixsnhpwrlbvvymkfamj.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeHNuaHB3cmxidnZ5bWtmYW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTExMTMsImV4cCI6MjA4NDU2NzExM30.h5VdhM4L4v_cT6qiRIwY6qoFM4AnzFCluXlM8mcW9Iw',
  WALKTHROUGH_VIDEO_URL: '',
  ERROR_REPORT_URL: ''
};
