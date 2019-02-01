/**Role**  
The Role model is used to track what permissions a user has
```javascript*/

export class Role {
    roleId: number; // primary key
    role: string; // not null, unique

    constructor(roleId, role) {
        this.roleId = roleId;
        this.role = role;
    }
}