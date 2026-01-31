import supabase from "./supabase";

export async function getClients() {
  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    console.error(error);
    throw new error("Client could not be loaded");
  }
  return data;
}

export async function getCustomers() {
  const { data, error } = await supabase.from("customers").select("*");

  if (error) {
    console.error(error);
    throw new error("Customers could not be loaded");
  }
  return data;
}
