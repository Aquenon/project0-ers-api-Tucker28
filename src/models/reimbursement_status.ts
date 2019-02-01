/**ReimbursementStatus**  
The ReimbursementStatus model is used to track the status of reimbursements. Status possibilities are `Pending`, `Approved`, or `Denied`.
```javascript*/

export class ReimbursementStatus {
    statusId: number; // primary key
    status: string; // not null, unique

    constructor (statusId = 0, status = '') {
        this.statusId = statusId;
        this.status = status;
    }
}