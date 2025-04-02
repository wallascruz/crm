// ... (Existing code)
import { supabase } from "@/lib/supabase";
import { User } from "@/types";

// ... (Other imports)

const addNewUser = async (name: string, email: string, role: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          role,
          company_id: 1, // Replace with the actual company ID
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error("Error adding user:", error);
      toast.error("Erro ao adicionar usuário.");
    } else {
      toast.success(`Usuário "${name}" adicionado com sucesso!`);
    }
  } catch (error) {
    console.error("Error adding user (catch):", error);
    toast.error("Erro ao adicionar usuário (catch).");
  }
};

// ... (Rest of the file)
