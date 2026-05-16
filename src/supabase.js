import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fkzkdwdnvluaifetvrwa.supabase.co'
const supabaseKey = 'sb_publishable_8hu-CtfIjHQeH4UKhBW_Zg_weHc9dsV'

export const supabase = createClient(supabaseUrl, supabaseKey)