/**ReimbursementStatus**  
The ReimbursementStatus model is used to track the status of reimbursements. Status possibilities are `Pending`, `Approved`, or `Denied`.
```javascript*/

export class ReimbursementStatus {
    statusID: number; // primary key
    status: string; // not null, unique

    constructor (statusID = 0, status = '') {
        this.statusID = statusID;
        this.status = status;
    }
}