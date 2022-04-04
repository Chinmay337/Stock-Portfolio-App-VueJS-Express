const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

var app = new Vue({
  el: "#app",
  data: {
    userId: uid,
    message: "",
    error: "",
    user: {},
    enableBuyForm: false,
    stockSymbol: "",
    stockDetail: {},
    buyQuantity: "",
    depositAmount: "",
  },
  created: function () {
    this.readUserData();
  },
  methods: {
    logMeOff() {
      window.location.href = "http://localhost:3000/app/users";
    },
    reset() {
      this.message = "";
      this.error = "";
      this.enableBuyForm = false;
      this.stockSymbol = "";
      this.stockDetail = {};
      this.buyQuantity = "";
      this.depositAmount = "";
    },

    readUserData() {
      fetch(`http://localhost:3000/api/users/${this.userId}`)
        .then((response) => {
          if (!response.ok) {
            this.error = "Invalid user: " + this.userId;
            return {};
          }
          return response.json();
        })
        .then((user) => {
          this.user = user;
        });
    },

    checkSymbol() {
      this.message = "Checking " + this.stockSymbol;
      this.error = "";

      fetch("http://localhost:3000/api/search/" + this.stockSymbol)
        .then((response) => {
          this.message = "";
          console.log(response);
          if (!response.ok) {
            this.error = "Invalid stock symbol: " + this.stockSymbol;
            this.stockSymbol = "";
            return {};
          }
          return response.json();
        })
        .then((myContent) => {
          this.stockDetail = myContent;
        })
        .catch((err) => {
          this.message = "";
          this.error = "Errir getting stock information";
          console.log("Error in check", err);
        });
    },

    async buyThis() {
      this.message = `Buying ${this.validQuantity} shares of ${this.stockDetail.name} (${this.stockDetail.symbol})`;
      console.log(this.message);

      let uri = `http://localhost:3000/api/users/${this.userId}/pos`;
      let fetchData = {
        method: "POST",
        body: JSON.stringify({
          symbol: this.stockDetail.symbol,
          quantity: this.validQuantity,
        }),
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json",
        }),
      };

      console.log(uri);

      try {
        let response = await fetch(uri, fetchData);
        this.message = "";

        if (!response.ok) {
          this.error = await response.text();
        } else {
          let message = `Successfully bought ${this.validQuantity} shares of ${this.stockDetail.name} (${this.stockDetail.symbol})`;
          this.reset();
          this.message = message;
          this.readUserData();
        }
      } catch (err) {
        this.message = "";
        this.error = "Error buying stock";
        console.log("Error in buy", err);
      }
    },

    async sellStock(pid) {
      let pos = this.user.portfolio.find((ele) => ele.id === pid);
      if (!pos) {
        this.error = "Invalid stock position to delete";
        return;
      }

      if (
        !confirm(
          `Do you want to sell ${pos.quantity} stocks of ${pos.name} (${pos.symbol})?\nPlease click OK to sell`
        )
      ) {
        return;
      }

      this.message = `Selling ${pos.quantity} stocks of ${pos.name} (${pos.symbol})...`;

      let uri = `http://localhost:3000/api/users/${this.userId}/pos/${pid}`;

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
          let message = `Successfully sold ${pos.quantity} stocks of ${pos.name} (${pos.symbol})`;
          this.reset();
          this.message = message;
          this.readUserData();
        }
      } catch (err) {
        this.message = "";
        this.error = "Error selling stock";
        console.log("Error in delete pos", err);
      }
    },

    async depositIntoAccount() {
      this.message = `Depositing ${this.validAmount} into account.`;
      console.log(this.message);

      if (
        !confirm(
          `Do you want to deposit ${this.formatAmount(
            this.validAmount
          )} into your account?\n Please click OK to proceed.`
        )
      ) {
        this.message = "Cancelled";
        this.depositAmount = "";
        return;
      }

      let uri = `http://localhost:3000/api/users/${this.userId}/cash`;
      let fetchData = {
        method: "POST",
        body: JSON.stringify({ amount: this.validAmount }),
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json",
        }),
      };

      console.log(uri);

      try {
        let response = await fetch(uri, fetchData);
        this.message = "";

        if (!response.ok) {
          this.error = await response.text();
        } else {
          let message = `Successfully deposited ${this.formatAmount(
            this.validAmount
          )} into account.`;
          this.reset();
          this.message = message;
          this.readUserData();
        }
      } catch (err) {
        this.message = "";
        this.error = "Error buying stock";
        console.log("Error in buy", err);
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
    haveValidUser: function () {
      return this.user && this.user.balance && this.user.firstName;
    },
    haveStockInfo: function () {
      return this.stockDetail && this.stockDetail.name;
    },
    validQuantity: function () {
      let quantity = parseInt(this.buyQuantity, 10);
      return !Number.isNaN(quantity) && quantity >= 1 ? quantity : "";
    },
    validAmount: function () {
      let amount = parseFloat(this.depositAmount);
      return !Number.isNaN(amount) && amount >= 1 ? amount : "";
    },
  },
});
