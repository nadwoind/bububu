import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fbgnpqobnsupprrhanir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZ25wcW9ibnN1cHBycmhhbmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjcyMDYsImV4cCI6MjA2MzI0MzIwNn0.aYMqLFoZ98Lr98bvCmhDl8Yw0qLhFboFjBB4E7IS-Xw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);