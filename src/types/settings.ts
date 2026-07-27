export type AppModuleId =
  | "finance"
  | "prayer"
  | "quran"
  | "adhkar"
  | "notes"
  | "documents"
  | "habits"

export interface AppModuleDefinition {
  id: AppModuleId
  label: string
  icon: string
  href: string
}

export interface UserProfile {
  name: string
  birthDate: string | null
  email: string | null
}