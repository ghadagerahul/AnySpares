import zipfile

OUTPUT_FILE = 'AnySparesApp_WorkFlow.docx'

content = {
    '[Content_Types].xml': '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>
''',
    '_rels/.rels': '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
''',
    'word/_rels/document.xml.rels': '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>
''',
    'word/styles.xml': '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:style w:type="paragraph" w:styleId="Normal">
      <w:name w:val="Normal"/>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Times New Roman"/>
        <w:sz w:val="22"/>
      </w:rPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Heading1">
      <w:name w:val="heading 1"/>
      <w:basedOn w:val="Normal"/>
      <w:pPr><w:spacing w:after="240"/></w:pPr>
      <w:rPr>
        <w:b/>
        <w:sz w:val="36"/>
      </w:rPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Heading2">
      <w:name w:val="heading 2"/>
      <w:basedOn w:val="Normal"/>
      <w:pPr><w:spacing w:before="120" w:after="180"/></w:pPr>
      <w:rPr>
        <w:b/>
        <w:sz w:val="28"/>
      </w:rPr>
    </w:style>
    <w:style w:type="paragraph" w:styleId="Code">
      <w:name w:val="Code"/>
      <w:basedOn w:val="Normal"/>
      <w:pPr><w:spacing w:before="100" w:after="100"/></w:pPr>
      <w:rPr>
        <w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>
        <w:sz w:val="20"/>
      </w:rPr>
    </w:style>
      <w:name w:val="Code"/>
      <w:basedOn w:val="Normal"/>
      <w:pPr><w:spacing w:before="100" w:after="100"/></w:pPr>
      <w:rPr>
        <w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>
        <w:sz w:val="20"/>
      </w:rPr>
    </w:style>
</w:styles>
'''
}

paragraphs = [
    ('Heading1', 'AnySpares App Complete Working Flow'),
    ('Normal', 'This document describes the AnySpares application step by step using clear headings, bold points, and simple diagrams.'),
    ('Normal', 'It is written for both developers and non-technical readers who want a quick but complete overview of the buyer and seller workflows.'),
    ('Heading2', 'Document Purpose'),
    ('Bold', 'The purpose of this document is to:'),
    ('Bullet', 'Provide a full overview of the AnySpares application flow.'),
    ('Bullet', 'Explain buyer and seller journeys clearly.'),
    ('Bullet', 'Show the checkout and payment process in an easy way.'),
    ('Heading2', '1. Application Overview'),
    ('Bold', 'AnySpares is an Angular application with two user roles:'),
    ('Bullet', 'Buyer: searches and purchases vehicle spare parts.'),
    ('Bullet', 'Seller: manages vehicles, brands, models, categories, and product listings.'),
    ('Normal', 'The app starts at the login page and uses routes for buyer pages, seller pages, checkout, payment, and order confirmation.'),
    ('Heading2', '2. Main Routes and Pages'),
    ('Bold', 'Main routes the app uses are:'),
    ('Bullet', '/login — Buyer login page.'),
    ('Bullet', '/register — Buyer registration page.'),
    ('Bullet', '/dashboard — Buyer dashboard after login.'),
    ('Bullet', '/vehicle-brands — Browse vehicle brands.'),
    ('Bullet', '/vehicle-models — Browse vehicle models.'),
    ('Bullet', '/vehicle-category — Browse spare part categories.'),
    ('Bullet', '/vehicle-product — Browse products.'),
    ('Bullet', '/vehicle-productDetails — Product details page.'),
    ('Bullet', '/view-cart — Bucket / cart page.'),
    ('Bullet', '/checkout — Checkout steps page.'),
    ('Bullet', '/order-success — Order confirmation page.'),
    ('Bullet', '/seller-login, /seller-register, /seller-dashboard, /seller-addproduct, /seller-editproduct — Seller management pages.'),
    ('Heading2', '3. Buyer Journey'),
    ('Bold', 'Buyer flow sections include:'),
    ('Bullet', 'Login or register to access the app.'),
    ('Bullet', 'Browse vehicle brands, models, categories, and products.'),
    ('Bullet', 'Add products to the bucket cart.'),
    ('Bullet', 'Edit bucket items or proceed to checkout.'),
    ('Bullet', 'Complete checkout details.'),
    ('Bullet', 'Place the order and view success confirmation.'),
    ('Heading2', '4. Buyer Login and Registration'),
    ('Normal', 'A returning buyer logs in with credentials and the app saves the token and current user data in browser storage.'),
    ('Normal', 'A new buyer registers first, then logs in to access product browsing and order flow.'),
    ('Heading2', '5. Product Browsing and Bucket'),
    ('Bold', 'How the buyer discovers products:'),
    ('Bullet', 'Select vehicle brand.'),
    ('Bullet', 'Select vehicle model.'),
    ('Bullet', 'Select category of spare parts.'),
    ('Bullet', 'View product details and add items to bucket.'),
    ('Normal', 'The bucket is managed by OrderService. Logged-in users can sync with an API, while guest users can use local storage as a fallback.'),
    ('Heading2', '6. Bucket Page (Cart)'),
    ('Bold', 'Bucket page features:'),
    ('Bullet', 'Adjust item quantity.'),
    ('Bullet', 'Remove items from bucket.'),
    ('Bullet', 'Clear the entire bucket.'),
    ('Bullet', 'Continue shopping.'),
    ('Bullet', 'Proceed to checkout.'),
    ('Heading2', '7. Checkout Workflow'),
    ('Bold', 'Checkout is completed in 3 steps:'),
    ('Bullet', 'Step 1: Select or add shipping address.'),
    ('Bullet', 'Step 2: Add contact details.'),
    ('Bullet', 'Step 3: Review items and total amount.'),
    ('Normal', 'Each step is validated. The user cannot continue until required information is entered and the bucket contains items.'),
    ('Heading2', '8. Payment Options'),
    ('Bold', 'The app supports two payment methods:'),
    ('Bullet', 'Cash on Delivery (COD) — place order directly.'),
    ('Bullet', 'Razorpay online payment — open payment dialog, verify payment, then place the order.'),
    ('Normal', 'After payment, the app clears checkout and bucket data and navigates to the order success screen.'),
    ('Heading2', '9. Order Success'),
    ('Normal', 'The order success page confirms the order and shows the order ID. The app resets the cart so the buyer can start a new order.'),
    ('Heading2', '10. Seller Workflow'),
    ('Bold', 'Seller functionality includes:'),
    ('Bullet', 'Seller login and registration.'),
    ('Bullet', 'Access seller dashboard.'),
    ('Bullet', 'Manage categories and parts.'),
    ('Bullet', 'Add vehicle brands and models.'),
    ('Bullet', 'Add or edit product listings.'),
    ('Normal', 'Seller screens are separate and focused on catalog management, not customer checkout.'),
    ('Heading2', '11. Service and Data Flow'),
    ('Bold', 'Key services used in the app:'),
    ('Bullet', 'AuthService — handles authentication, token storage, and current user state.'),
    ('Bullet', 'OrderService — manages bucket state, API calls, updates, and order placement.'),
    ('Bullet', 'CheckoutService — stores checkout steps, address, contact, payment method, and totals.'),
    ('Heading2', '12. Detailed Buyer Flow Diagram'),
    ('Code', '+---------------------+'),
    ('Code', '| 1. Login/Register   |'),
    ('Code', '+----------+----------+'),
    ('Code', '           |'),
    ('Code', '           v'),
    ('Code', '+---------------------+'),
    ('Code', '| 2. Browse Products   |'),
    ('Code', '+----------+----------+'),
    ('Code', '           |'),
    ('Code', '           v'),
    ('Code', '+---------------------+'),
    ('Code', '| 3. Add to Bucket     |'),
    ('Code', '+----------+----------+'),
    ('Code', '           |'),
    ('Code', '           v'),
    ('Code', '+---------------------+'),
    ('Code', '| 4. View Cart         |'),
    ('Code', '+----------+----------+'),
    ('Code', '           |'),
    ('Code', '           v'),
    ('Code', '+---------------------+'),
    ('Code', '| 5. Checkout          |'),
    ('Code', '+----------+----------+'),
    ('Code', '           |'),
    ('Code', '           v'),
    ('Code', '+---------------------+'),
    ('Code', '| 6. Payment           |'),
    ('Code', '+----------+----------+'),
    ('Code', '           |'),
    ('Code', '           v'),
    ('Code', '+---------------------+'),
    ('Code', '| 7. Success           |'),
    ('Code', '+---------------------+'),
    ('Heading2', '13. Service Interaction Diagram'),
    ('Code', 'Login Page → AuthService → Store token + current user'),
    ('Code', 'Product Pages → OrderService → Add item to bucket'),
    ('Code', 'Bucket Page → OrderService → Update or remove items'),
    ('Code', 'Checkout Page → CheckoutService → Save address and contact'),
    ('Code', 'Payment Page → Razorpay + OrderService → Place order'),
    ('Heading2', '14. How to Run the App'),
    ('Normal', '1. Open a terminal in the project folder.'),
    ('Normal', '2. Run npm install to install dependencies.'),
    ('Normal', '3. Run ng serve to start the app.'),
    ('Normal', '4. Open http://localhost:4200 in the browser.'),
    ('Heading2', '15. How to Create This Document'),
    ('Normal', 'Run the Python generator script with the command below:'),
    ('Code', 'python3 generate_flow_doc.py'),
    ('Normal', 'The generated file is AnySparesApp_WorkFlow.docx in the same folder.'),
]

xml_header = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'

body = []

def make_text(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

for style, text in paragraphs:
    escaped = make_text(text)
    if style == 'Heading1':
        body.append('<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>' + escaped + '</w:t></w:r></w:p>')
    elif style == 'Heading2':
        body.append('<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>' + escaped + '</w:t></w:r></w:p>')
    elif style == 'Bold':
        body.append('<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>' + escaped + '</w:t></w:r></w:p>')
    elif style == 'Bullet':
        bullet_text = '• ' + escaped
        body.append('<w:p><w:r><w:t>' + bullet_text + '</w:t></w:r></w:p>')
    elif style == 'Code':
        body.append('<w:p><w:pPr><w:pStyle w:val="Code"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/></w:rPr><w:t xml:space="preserve">' + escaped + '</w:t></w:r></w:p>')
    else:
        body.append('<w:p><w:r><w:t>' + escaped + '</w:t></w:r></w:p>')

content['word/document.xml'] = xml_header + '''<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
''' + '\n'.join(body) + '''
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>
'''

with zipfile.ZipFile(OUTPUT_FILE, 'w', zipfile.ZIP_DEFLATED) as docx:
    for path, data in content.items():
        docx.writestr(path, data)

print(f'Created {OUTPUT_FILE}')
