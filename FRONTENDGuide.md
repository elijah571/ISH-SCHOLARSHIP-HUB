ISH Scholarship Hub – Auth & Security API Frontend Guide
Base URL
Localurl:http://localhost:5000
Prod: https://ish-scholarship-hub.onrender.com
CSRF Token
GET /csrf
The frontend must request a CSRF token before sending POST requests.
Example:
GET /csrf
Save the returned token and include it in headers:
X-XSRF-TOKEN: <csrfToken>

Authentication Flow
Get CSRF Token
Register User
Verify Email
Login
Use Access Token
Refresh Token when expired
Logout

1. Register
POST /api/auth/register
Body:
{
"fullName": "John Doe",
"email": "john@example.com",
"password": "Password123!"
}
Headers:
X-XSRF-TOKEN: csrfToken
Response:
{
success: true,
message: "Registration successful. Please verify your email",
user: {}
}
After registration the user must verify email.

2. Verify Email
GET /api/auth/verify-email?token=
The frontend should redirect the user to this endpoint when they click the verification email link.
Example frontend page:
/pages/verify-email?token=
Flow:
Extract token from URL
Send request to backend
Show success message

3. Login
POST /api/auth/login
Body:
{
"email": "john@example.com",
"password": "Password123!"
}
Headers:
Content-Type: application/json
X-XSRF-TOKEN: csrfToken
Response:
{
success: true,
accessToken: "JWT",
data: { user }
}
Important:
Access token returned in JSON
Refresh token stored in HTTP Only Cookie automatically
Frontend must store accessToken in memory or state manager.

4. Authenticated Requests
Use accessToken in Authorization header.
Authorization: Bearer
Example:
GET /api/user/profile

5. Refresh Token
POST /api/auth/refresh
No body required.
The browser automatically sends refreshToken cookie.
Response:
{
success: true,
accessToken: "newAccessToken"
}
Frontend should replace old accessToken.

6. Forgot Password
POST /api/auth/forgot-password
Body:
{
"email": "john@example.com"
}
User receives reset link by email.

7. Reset Password
POST /api/auth/reset-password/:token
Body:
{
"password": "NewPassword123!"
}
Token comes from reset email link.



9. Logout All Devices
POST /api/auth/logout-all
Headers:
Authorization: Bearer
This clears all active sessions.

Important Security Notes
Refresh token stored in httpOnly cookie.
Access token stored in memory.
CSRF token required for POST requests.
Access tokens expire quickly.
Refresh endpoint issues new tokens.

Example Frontend Auth Flow
App loads
GET /csrf
User logs in
Store accessToken
Use Authorization header
If 401 -> call /refresh
Retry request

Recommended Frontend Stack
React / Next.js
Axios Interceptors
React Query or Redux

Axios Example
const api = axios.create({
baseURL: "http://localhost:5000",
withCredentials: true
})
api.interceptors.request.use((config)=>{
config.headers.Authorization = Bearer ${accessToken}
return config
})



Blog API – Frontend Integration Guide
This guide explains how the frontend should interact with the Blog API including CSRF protection, authentication, file uploads, and CRUD operations.
Base URL
http://localhost:3000

1. Get CSRF Token
Endpoint
GET /api/csrf
Purpose
The frontend must first request a CSRF token before making any POST, PATCH, or DELETE requests.
Example
GET {{baseUrl}}/api/csrf
Save the returned token and send it in the header:
X-XSRF-TOKEN:

2. Create Blog (Admin Only)
Endpoint
POST /api/blog/create
Headers
Authorization: Bearer
X-XSRF-TOKEN:
Body (form-data)
title: string
content: string
slug: string
published: boolean
image: file
Example FormData
const form = new FormData()
form.append("title","My First Blog")
form.append("content","Blog content here")
form.append("slug","my-first-blog")
form.append("published",true)
form.append("image",file)

3. Get All Blogs
Endpoint
GET /api/blog
Query Parameters
page
limit
Example
GET /api/blog?page=1&limit=10
Response contains paginated blog list.

4. Search Blogs
Endpoint
GET /api/blog?search=
Example
GET /api/blog?search=blog
Returns blogs matching title/content.

5. Get Blog By ID
Endpoint
GET /api/blog/:blogId
Example
GET /api/blog/64bdbdbd33
Used for blog detail pages.

6. Update Blog
Endpoint
PATCH /api/blog/:blogId
Headers
Authorization: Bearer
X-XSRF-TOKEN:
Body (form-data optional)
Example
form.append("published",true)
Used to update blog content or publish state.

7. Delete Blog
Endpoint
DELETE /api/blog/:blogId
Headers
Authorization: Bearer
X-XSRF-TOKEN:
Example
DELETE /api/blog/123
Deletes the blog post.

Frontend Blog Flow
Fetch blogs list
View blog details
Admin logs in
Admin creates blog
Admin edits blog
Admin deletes blog

Image Upload Notes
Image upload uses multipart/form-data.
Frontend must use FormData instead of JSON.
Example
const formData = new FormData()
formData.append("title",title)
formData.append("content",content)
formData.append("slug",slug)
formData.append("published",published)
formData.append("image",imageFile)

Axios Example
const api = axios.create({
baseURL:"http://localhost:3000",
withCredentials:true
})
async function createBlog(data){
return api.post("/api/blog/create",data,{headers:{
Authorization:Bearer ${accessToken},
"X-XSRF-TOKEN":csrfToken
}})
}

Recommended Frontend Pages
/blog
Blog list page
/blog/[slug]
Single blog page
/admin/blog
Admin blog dashboard
/admin/blog/create
Create blog page
/admin/blog/edit/[id]
Edit blog page

Security Notes
Only admins should create, update, or delete blogs.
Access token must be sent in Authorization header.
CSRF token required for POST, PATCH, DELETE.
Images must be uploaded using FormData.


Newsletter API – Frontend Integration Guide
This document explains how the frontend should integrate with the Newsletter API for subscribing users and sending newsletters.
Base URLs
Backend API
http://localhost:3000

1. Get CSRF Token
Endpoint
GET /api/csrf
Example
GET http://localhost:3000/api/csrf
Purpose
The frontend must request a CSRF token before making any POST requests.
Save the token and include it in request headers:
X-XSRF-TOKEN:

2. Auth - Signup
Endpoint
POST /api/auth/signup
Example
POST http://localhost:3000/api/auth/signup
Headers
Content-Type: application/json
Body
{
"name": "Elijah Peter",
"email": "elijah@example.com",
"password": "Password123"
}
Response
User account created successfully.

3. Auth - Login
Endpoint
POST /api/auth/login
Example
POST http://localhost:5000/api/auth/login
Headers
Content-Type: application/json
Body
{
"email": "elijah@example.com",
"password": "Password123"
}
Response
{
"success": true,
"accessToken": "JWT_TOKEN"
}
Frontend must store the access token.

4. Newsletter - Send (Admin Only)
Endpoint
POST /api/newsletter/send
Example
POST http://localhost:3000/api/newsletter/send
Headers
Authorization: Bearer
Content-Type: application/json
X-XSRF-TOKEN:
Body
{
"subject": "New Scholarships Available",
"content": "Check out these new scholarships for this month!"
}
Purpose
Send newsletter email to all subscribed users.
Only admin users should be allowed to call this endpoint.

5. Newsletter - Subscribe
Endpoint
POST /api/newsletter/subscribe
Example
POST http://localhost:3000/api/newsletter/subscribe
Headers
Content-Type: application/json
X-XSRF-TOKEN:
Body
{
"email": "elijahdev20@gmail.com"
}
Purpose
Allows users to subscribe to the newsletter mailing list.

Frontend Newsletter Flow
User visits website
User enters email in newsletter form
Frontend calls /api/newsletter/subscribe
Email stored in database
Admin logs into dashboard
Admin sends newsletter via /api/newsletter/send
Email sent to all subscribers

Example Frontend Newsletter Form
Example using fetch
const subscribe = async (email) => {
await fetch('/api/newsletter/subscribe',{
method:'POST',
headers:{
'Content-Type':'application/json',
'X-XSRF-TOKEN':csrfToken
},
body:JSON.stringify({email})
})
}

Admin Newsletter Panel
Recommended admin UI
/admin/newsletter
Features
Send newsletter
Write subject
Write email content
Click send

Security Notes
Sending newsletters should be restricted to admin users.
CSRF token required for POST requests.
Access token required for protected routes.
Input validation should be implemented for email addresses.

Recommended Frontend Pages
/
Homepage with newsletter subscribe form
/admin/newsletter
Admin dashboard page to send newsletters


Scholarship API – Frontend Integration Guide
This guide explains how the frontend should integrate with the Scholarship API including creation, search, filtering, pagination and admin management.
Base URL
http://localhost:3000

1. Get CSRF Token
Endpoint
GET /api/csrf
Example
GET {{BASE_URL}}/api/csrf
Purpose
The frontend must request a CSRF token before making POST, PATCH, or DELETE requests.
Save the token and include it in headers:
X-CSRF-Token:

2. Create Scholarship (Admin Only)
Endpoint
POST /api/scholarship/create
Headers
Authorization: Bearer
X-CSRF-Token:
Body (form-data)
Fields
title
description
country
deadline
funding_type
image
link
duration
Example
const form = new FormData()
form.append("title","Canada Fully Funded Scholarship")
form.append("description","This scholarship covers tuition and living expenses")
form.append("country","Canada")
form.append("deadline","2026-06-30")
form.append("funding_type","Fully Funded")
form.append("duration","4 years")
form.append("link","https://example.com")
form.append("image",file)
Only admin users should be able to create scholarships.

3. Get All Scholarships
Endpoint
GET /api/scholarship
Example
GET /api/scholarship
Returns all scholarships.
Used for scholarship listing pages.

4. Search Scholarships
Endpoint
GET /api/scholarship?search=
Example
GET /api/scholarship?search=Nigeria
Searches scholarships by title, description or country.

5. Filter Scholarships
Endpoint
GET /api/scholarship?country=&funding_type=
Example
GET /api/scholarship?country=Canada&funding_type=Fully Funded
Possible filters
country
funding_type
Used for advanced filtering in UI.

6. Pagination
Endpoint
GET /api/scholarship?page=1&limit=5
Query Parameters
page
limit
Example
GET /api/scholarship?page=1&limit=5
Used to implement infinite scroll or paginated lists.

7. Get Scholarship By ID
Endpoint
GET /api/scholarship/:id
Example
GET /api/scholarship/123
Used for scholarship detail pages.

8. Update Scholarship
Endpoint
PATCH /api/scholarship/:id
Headers
Authorization: Bearer
X-CSRF-Token:
Body (form-data optional)
Example
form.append("title","Masters Scholarship")
form.append("duration","3 years")
Used by admins to update scholarship information.

9. Delete Scholarship
Endpoint
DELETE /api/scholarship/:id
Headers
Authorization: Bearer
X-CSRF-Token:
Example
DELETE /api/scholarship/123
Deletes the scholarship record.

Frontend Scholarship Flow
User visits scholarships page
Frontend fetches scholarships list
User searches scholarships
User filters by country or funding type
User opens scholarship details
Admin logs into dashboard
Admin creates scholarship
Admin edits scholarship
Admin deletes scholarship

Image Upload Notes
Scholarship images must be uploaded using multipart/form-data.
Example
const formData = new FormData()
formData.append("title",title)
formData.append("description",description)
formData.append("image",imageFile)

Axios Example
const api = axios.create({
baseURL:"http://localhost:3000",
withCredentials:true
})
async function createScholarship(data){
return api.post("/api/scholarship/create",data,{headers:{
Authorization:Bearer ${accessToken},
"X-CSRF-Token":csrfToken
}})
}

Recommended Frontend Pages
/scholarships
Scholarship listing page
/scholarships/[id]
Scholarship detail page
/admin/scholarships
Admin scholarship dashboard
/admin/scholarships/create
Create scholarship page
/admin/scholarships/edit/[id]
Edit scholarship page

Security Notes
Only admins should create, update, or delete scholarships.
Access token required for protected endpoints.
CSRF token required for POST, PATCH, DELETE.
File uploads must use FormData.

Internship API – Frontend Integration Guide
This guide explains how the frontend should integrate with the Internship API including CRUD operations, authentication, CSRF protection, and file uploads.
Base URL
http://localhost:3000/api

1. Create Internship (Admin Only)
Endpoint
POST /internship/create
Headers
Authorization: Bearer
X-CSRF-Token:
Body (form-data)
Fields
title
description
country
deadline
type (Remote / Onsite / Hybrid)
institution
startDate
endDate
link
image (file)
Example
const form = new FormData()
form.append("title","Software Intern")
form.append("description","Detailed internship description...")
form.append("country","USA")
form.append("deadline","2026-12-30")
form.append("type","Remote")
form.append("institution","Google")
form.append("startDate","2026-10-01")
form.append("endDate","2027-01-01")
form.append("link","https://example.com")
form.append("image",file)
Only admin users should be allowed to create internships.

2. Get All Internships
Endpoint
GET /internship
Example
GET /internship
Returns list of all internships.
Used for listing page.

3. Get Internship By ID
Endpoint
GET /internship/:id
Example
GET /internship/123
Used for internship detail page.

4. Update Internship
Endpoint
PATCH /internship/:id
Headers
Authorization: Bearer
X-CSRF-Token:
Body (form-data optional)
Example
form.append("title","Updated Internship Title")
Used to update internship details.

5. Delete Internship
Endpoint
DELETE /internship/:id
Headers
Authorization: Bearer
X-CSRF-Token:
Example
DELETE /internship/123
Deletes internship.

Frontend Internship Flow
User visits internships page
Frontend fetches internship list
User views internship details
Admin logs into dashboard
Admin creates internship
Admin updates internship
Admin deletes internship

Image Upload Notes
Internship images must be uploaded using multipart/form-data.
Example
const formData = new FormData()
formData.append("title",title)
formData.append("image",imageFile)

Axios Example
const api = axios.create({
baseURL:"http://localhost:3000/api",
withCredentials:true
})
async function createInternship(data){
return api.post("/internship/create",data,{headers:{
Authorization:Bearer ${accessToken},
"X-CSRF-Token":csrfToken
}})
}

Recommended Frontend Pages
/internships
Internship listing page
/internships/[id]
Internship detail page
/admin/internships
Admin internship dashboard
/admin/internships/create
Create internship page
/admin/internships/edit/[id]
Edit internship page

Security Notes
Only admins should create, update, or delete internships.
Access token required for protected routes.
CSRF token required for POST, PATCH, DELETE.
File uploads must use FormData.

