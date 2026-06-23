import { ContactInbox } from "@/components/admin/ContactInbox";
import { getContactSubmissions } from "@/lib/data/contact";

export default async function AdminContactPage() {
  const submissions = await getContactSubmissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Contact Inbox</h1>
        <p className="text-text-muted mt-1">
          General inquiries, support, pricing, and problem reports.
        </p>
      </div>
      <ContactInbox submissions={submissions} />
    </div>
  );
}
