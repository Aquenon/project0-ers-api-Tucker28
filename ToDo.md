### **Find Users By Id**  
* **Allowed Roles** `finance-manager` or if the id provided matches the id of the current user

### **Find Reimbursements By Status**  
Reimbursements should be ordered by date
Working.  Just need final SQL JOIN statement

### **Find Reimbursements By User**  
Reimbursements should be ordered by date
Working.  Just need final SQL JOIN statement
**Allowed Roles** `finance-manager` or if the userId is the user making the request.





### **Update Reimbursement**  
* **URL**
  `/users`

* **Method:**
  `PATCH`

* **Allowed Roles** `finance-manager`

* **Request**
  The reimbursementId must be presen as well as all fields to update, any field left undefined will not be updated. This can be used to approve and deny.
  ```javascript
    Reimbursement
  ```

* **Response:**
    ```javascript
      Reimbursement
    ```
