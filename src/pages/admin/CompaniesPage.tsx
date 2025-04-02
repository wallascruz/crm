// ... (Existing code)
import { supabase } from "@/lib/supabase";
import { Company } from "@/types";

// ... (Other imports)

const addCompany = async (name: string) => {
  try {
    const { data, error } = await supabase
      .from("companies")
      .insert([{ name, created_at: new Date().toISOString() }]);

    if (error) {
      console.error("Error adding company:", error);
      toast.error("Erro ao adicionar empresa.");
    } else {
      toast.success(`Empresa "${name}" criada com sucesso!`);
    }
  } catch (error) {
    console.error("Error adding company (catch):", error);
    toast.error("Erro ao adicionar empresa (catch).");
  }
};

// ... (Rest of the file)
