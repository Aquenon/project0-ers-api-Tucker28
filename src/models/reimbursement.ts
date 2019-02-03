import { typeID } from "./reimbursement_type";
import { statusID } from "./reimbursement_status";
import { User } from "./user";
import { ReimbursementStatus } from "./reimbursement_status";
import { ReimbursementType } from "./reimbursement_type";
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

    constructor(reimbursementId = 0, author = User, amount = 0, dateSubmitted = 0, dateResolved = 0, description = '', resolver = User, status = 0, type = 0) {
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