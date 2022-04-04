const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

var app = new Vue({
  el: "#app",
  data: {
    mode: "",
    message: "",
    error: "",
    users: [],
    firstName: "",
    lastName: "",
    balance: "",
    editUserId: "",
  },

  created: function () {
    this.readAllUsers();
  },
  methods: {
    goToUser(id) {
      window.location.href = "http://localhost:3000/app/userDetails/" + id;
    },

    reset() {
      this.mode = "";
      this.message = "";
      this.error = "";
      this.firstName = "";
      this.lastName = "";
      this.balance = "";
    },

    startAddUser() {
      this.reset();
      this.mode = "ADD";
    },

    startEditUser(id) {
      let user = this.users.find((ele) => ele.id === id);
      if (!user) {
        this.error = "Invalid user to edit";
        return;
      }

      this.reset();
      this.editUserId = user.id;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.balance = user.balance;
      this.mode = "EDIT";
    },

    readAllUsers() {
      fetch("http://localhost:3000/api/users")
        .then((response) => {
          return response.json();
        })
        .then((userList) => {
          this.users = userList;
          console.log(userList);
        });
    },

    async addUser() {
      this.message = `Adding user ${this.firstName} ${this.lastName} with initial balance of ${this.validBalance}`;
      let uri = "http://localhost:3000/api/users";
      let fetchData = {
        method: "POST",
        body: JSON.stringify({
          firstName: this.firstName,
          lastName: this.lastName,
          balance: this.validBalance,
        }),
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json",
        }),
      };

      try {
        let response = await fetch(uri, fetchData);
        this.message = "";
        if (!response.ok) {
          this.error = await response.text();
        } else {
          let message = `Successfully added user ${this.firstName} ${this.lastName} with initial balance of ${this.validBalance}`;
          this.reset();
          this.message = message;
          this.readAllUsers();
        }
      } catch (err) {
        this.message = "";
        this.error = "Error adding user";
        console.log("Error in add user", err);
      }
    },

    async editUser() {
      // this.message=`Adding user ${this.firstName}  ${this.lastName}with initial balance of ${this.validBalance}`;
      let uri = "http://localhost:3000/api/users/" + this.editUserId;
      let fetchData = {
        method: "PUT",
        body: JSON.stringify({
          firstName: this.firstName,
          lastName: this.lastName,
          balance: this.validBalance,
        }),
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json",
        }),
      };

      try {
        let response = await fetch(uri, fetchData);
        this.message = "";
        if (!response.ok) {
          this.error = await response.text();
        } else {
          let message = `Successfully updated user ${this.firstName} ${this.lastName} with balance of ${this.validBalance}`;
          this.reset();
          this.message = message;
          this.readAllUsers();
        }
      } catch (err) {
        this.message = "";
        this.error = "Error adding user";
        console.log("Error in add user", err);
      }
    },

    async deleteUser(id) {
      let user = this.users.find((ele) => ele.id === id);
      if (!user) {
        this.error = "Invalid user to delete";
        return;
      }

      if (
        !confirm(
          `Do you want to delete user ${user.firstName} ${user.lastName}\n\nNOTE: This will also delete all of the users portfolio\n\nPlease click OK to proceed`
        )
      ) {
        return;
      }

      this.message = `Deleting user ${user.firstName} ${user.lastName}...`;
      let uri = "http://localhost:3000/api/users/" + id;
      let fetchData = {
        method: "DELETE",
        headers: new Headers({
          Accept: "application/json",
        }),
      };

      try {
        let response = await fetch(uri, fetchData);
        this.message = "";
        if (!response.ok) {
          this.error = await response.text();
        } else {
          let message = `Successfully deleted the user ${user.firstName} ${user.lastName}`;
          this.reset();
          this.message = message;
          this.readAllUsers();
        }
      } catch (err) {
        this.message = "";
        this.error = "Error deleting user";
        console.log("Error in delete user", err);
      }
    },

    //----------------------------------
    // Utility functions

    formatDate(value) {
      const dt = new Date(value);
      return dt.toDateString();
    },

    formatAmount(value) {
      const amount = Math.round(value * 100) / 100.0;
      return formatter.format(amount);
    },
  },

  computed: {
    validBalance: function () {
      let balance = parseFloat(this.balance);
      return !Number.isNaN(balance) && balance >= 0.0 ? balance : "";
    },

    formIsValid: function () {
      return (
        this.firstName != "" && this.lastName != "" && this.validBalance != ""
      );
    },

    operationTitle: function () {
      if (this.mode == "ADD") {
        return "Add new user";
      } else if (this.mode == "EDIT") {
        return "Edit User";
      } else {
        return "";
      }
    },
  },
});
