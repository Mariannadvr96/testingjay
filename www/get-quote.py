import frappe
import json
from frappe.utils.file_manager import upload, save_file


def get_context(context):
    context.no_cache = True
    context.show_sidebar = True
    context.show_search = True


@frappe.whitelist(allow_guest=True)
def create_lead(data):
    try:
        data = json.loads(data)
        lead_doc = frappe.new_doc("Lead")
        lead_doc.first_name = data.get("first_name") or ""
        lead_doc.last_name = data.get("last_name") or ""
        lead_doc.email_id = data.get("email") or ""
        lead_doc.phone = data.get("phone") or ""
        lead_doc.custom_what_best_describes_yourself = data.get(
            "describes_your_self") or ""
        lead_doc.custom_topic_of_your_inquiry = "\n".join(
            data.get("inquiry_topic")) or ""
        lead_doc.custom_message_ = data.get("message") or ""
        lead_doc.custom_nda = data.get("nda")
        lead_doc.custom_inquiry_company = data.get("company_name") or ""
        lead_doc.custom_product_development = data.get("stage") or ""
        lead_doc.custom_budget = data.get("budget") or ""
        lead_doc.custom_project_type = data.get("project_type") or ""
        lead_doc.custom_project_timeline = data.get("timeline") or ""
        lead_doc.custom_hear_about_us = data.get("hear_about_us") or ""

        lead_doc.insert(ignore_permissions=True)

        attachments = data.get("attachments")
        if attachments:
             for file in attachments:
                filename = file.get("name") 
                save_file(
                filename,
                file.get("base64"),
                "Lead",
                lead_doc.name,
                decode=True,
                is_private=0)

                frappe.db.commit()

                

        if lead_doc.name:
            return {"name": lead_doc.name}
    except Exception as e:
        return str(e)

#     "first_name": document.querySelector("#first_name").value,
#     "last_name": document.querySelector("#last_name").value,
#     "email": document.querySelector("#email").value,
#     "phone": document.querySelector("#phone").value,

#     //

#     "describes_your_self": document.querySelector("#describes_your_self").value,
#     "inquiry_topic": inquiryOptions,
#     "message": document.querySelector("#message").value,
#     //
#     "attachment_file_name": AttachFile.getAttribute("file-name"),
#     "attachment_file_base64": AttachFile.getAttribute("file-base64"),
#     //
#     "hear_about_us": document.querySelector("#hear_about_us").value,

#     "nda": document.querySelector("#nda-yes").value == "on" ? 1 : 0,
#     "company_name": document.querySelector("#company_name").value,
#     "stage": document.querySelector("#stage").value,
#     "project_type": document.querySelector("#project_type").value,
#     "budget": document.querySelector("#budget").value,
#     "timeline": document.querySelector("#timeline").value,

# }
