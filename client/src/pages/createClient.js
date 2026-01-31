import { createClient } from "@supabase/supabase-js"; //(from original source)

// from video
export const supabase = createClient(
  "https://rlrctqxmsdzbwbwwodve.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscmN0cXhtc2R6Yndid3dvZHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDg2NjksImV4cCI6MjA3MjMyNDY2OX0.EgcRxggXLddRLaEzifaFIP4MLxqnC_orC3S60Ax6vr0"
);

// const supabase = createClient(supabaseUrl, supabaseKey); (from original source)

//const supabaseUrl = "https://rlrctqxmsdzbwbwwodve.supabase.co"; //(from original source)
//const supabaseKey = process.env.SUPABASE_KEY; //(from original source)
