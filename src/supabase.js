import {createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://bdqommigcbpeqiryifon.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhY" +
    "mFzZSIsInJlZiI6ImJkcW9tbWlnY2JwZXFpcnlpZm9uIiwicm9sZSI6ImFub24iLCJpYXQiOj" +
    "E2NzQwMzg4NDYsImV4cCI6MTk4OTYxNDg0Nn0.nhOdoHKKPOo5fQUDjH31fNd_4R8SJJ5ww6gt-yIO_hg";
const supabase = createClient(supabaseUrl, supabaseKey)


export default supabase;
