## Start
npm run build && npm run start

## Example
curl -X POST http://localhost:3000/execute-tree \
-H "Content-Type: application/json" \
-d '{
  "type": "Condition",
  "condition": "new Date().getDate() <= 25",
  "trueAction": {
    "type": "SendSMS",
    "phoneNumber": "1234567890"
  },
  "falseAction": null
}'

## The solution to the problem: Turning the platform into a SaaS
1. How can the system be designed so that each company can provide games on its gaming website from its domain?
- Multi-domain architecture: Configure servers so that each domain points to the same gPlatform infrastructure, but provides a unique context depending on the domain. This can be implemented using:
- DNS record settings for each company sending requests to the same server.
- Using the Host header of the HTTP request to determine which company the request belongs to.
- Implement a routing layer in the application to customize the UI, data, and context according to the company.
- Company configuration: In the platform, create a Companies table with information about each company (domain, settings, branding, etc.) to associate queries with a specific company.
- Containerization or multiplexing: Each company gets its own subdomain or a separate namespace within the overall architecture.

2. What changes do I need to make to the users table to support these changes?
- Add the company_id field: The user table should contain a field indicating the company the user belongs to.
- The uniqueness of the email must be changed to account for the company.
- Changing user identification: If the email remains unique only within one company, use the company_id + email combination to search for the user.

3. How, using one backend cluster, can I verify a user's login on one game domain so that he does not gain access to others?
- Separation of sessions: When authenticating a user from a specific domain, the user's session must be linked to company_id.
- Use a JWT or a token containing company_id in the payload to always verify the user's affiliation with the company.
- Login validation: When trying to log in, check whether the Host or domain from the request matches the company to which the user belongs.
- At the authorization level, make sure that all requests coming from the user are associated with the domain specified in the token.
- Never use cross-domain cookies for authentication.
- Link the user's authorization to a specific company via the domain ID.