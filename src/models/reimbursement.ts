import { typeID } from "./reimbursement_type";
import { statusID } from "./reimbursement_status";
import { User } from "./user";
/**Reimbursement**  
The Reimbursement model is used to represent a single reimbursement that an employee would submit
```javascript*/

export class Reimbursement {
    reimbursementId: number; // primary key
	author: User;  // foreign key -> User, not null
	amount: number;  // not null
    dateSubmitted: number; // not null
    dateResolved: number; // not null
    description: string; // not null
    resolver: User; // foreign key -> User
    status: statusID; // foreign ey -> ReimbursementStatus, not null
    type: typeID; // foreign key -> ReimbursementType

    constructor(reimbursementId, author, amount, dateSubmitted, dateResolved, description, resolver, status, type) {
        this.reimbursementId = reimbursementId;
        this.author = author;
        this.amount = amount;
        this.dateSubmitted = dateSubmitted;
        this.dateResolved = dateResolved;
        this.description = description;
        this.resolver = resolver;
        this.status = status;
        this.type = type;
    }
}