// to be un commented origional 

// const { createClient } = require("@supabase/supabase-js");

// const supabaseUrl = "https://rlrctqxmsdzbwbwwodve.supabase.co";
// const supabaseKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscmN0cXhtc2R6Yndid3dvZHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDg2NjksImV4cCI6MjA3MjMyNDY2OX0.EgcRxggXLddRLaEzifaFIP4MLxqnC_orC3S60Ax6vr0";

// const supabase = createClient(supabaseUrl, supabaseKey);

// module.exports = supabase;



// to be deleted one not needed

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = supabase;
