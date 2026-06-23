export const deyaaContactTopics = [
  { value: "water_supply", label: "Υδροληψία & παροχή" },
  { value: "sewerage", label: "Αποχέτευση" },
  { value: "billing", label: "Λογαριασμός & πληρωμές" },
  { value: "connection", label: "Διακοπή / επανασύνδεση" },
  { value: "network_damage", label: "Βλάβη δικτύου" },
  { value: "general", label: "Γενική ερώτηση" },
] as const;

export type DeyaaContactTopic = (typeof deyaaContactTopics)[number]["value"];

export function getContactTopicLabel(value: string): string {
  return deyaaContactTopics.find((t) => t.value === value)?.label ?? value;
}
