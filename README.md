# crud_application_users_auth_post

A practical implementation of a backend application. Basic overview includes - 
1. 2 types of users - Regular User (USER) and Admin (ADMIN). 
2. Both types of users have Sign In, Sign Out, and Sign Up capabilities (featuring JWT authentication with a 10 minute expiration time, following which there is automatic Sign Out)
3. USER's can create posts
3. As soon as a USER creates a post, its default status is 'Verification Pending'. Upon review + approval from ADMIN, post becomes Approved and can now be seen by all users on the platform (posts with pending verification can only be seen by the USER who made them)
4. Upon review, ADMIN may decide that a post made by a certain USER violates Community Guidelines and may therefore choose to delete said post (soft delete)
