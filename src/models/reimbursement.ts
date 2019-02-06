import { User } from "./user";
import { ReimbursementStatus } from "./reimbursement_status";
import { ReimbursementType } from "./reimbursement_type";

/**Reimbursement**  
The Reimbursement model is used to represent a single reimbursement that an employee would submit
```javascript*/

export class Reimbursement {
    reimbursementID: number; // primary key
	author: User;  // foreign key -> User, not null
	amount: number;  // not null
    dateSubmitted: number; // not null
    dateResolved: number; // not null
    description: string; // not null
    resolver: User; // foreign key -> User
    status: ReimbursementStatus; // foreign key -> ReimbursementStatus, not null
    type: ReimbursementType; // foreign key -> ReimbursementType

    constructor(reimbursementID = 0, author: User = undefined, amount = 0,
        dateSubmitted = 0, dateResolved = 0, description = '',
        resolver: User = undefined, status: ReimbursementStatus = undefined,
        type: ReimbursementType = undefined) {
            this.reimbursementID = reimbursementID;
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