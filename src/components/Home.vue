<template>
    <b-container class="my-4">
      <b-row>
        <b-col>
          <b-card header-tag="header" footer-tag="footer">
            <template #header>
              <h4 class="mb-0">Deposit</h4>
            </template>
            <b-card-text>
              <b-form @submit="onSubmitDeposit">
                <b-container class="py-4 fluid">
                    <b-form-group
                  id="deposit-value-group"
                  label="Deposit Value: "
                  label-for="deposit-value-input"
                  description="ETH Value to be Deposited"
                >
                  <b-form-input
                    id="deposit-value-input"
                    v-model="deposit.value"
                    type="number"
                    placeholder="ETH"
                    required></b-form-input>
                </b-form-group>
              </b-container>
                <b-container class="py-4 fluid">
                  <b-card>
                    <b-form-group
                      id="deposit-receiver-pk-group"
                      label="Receiver's Public Key: "
                      label-for="deposit-receiver-pk-input"
                      description="Public Key of the Receiver"
                      >
                      <b-form-file accept=".pem, .txt"
                        id="deposit-receiver-pk-input"
                        v-model="deposit.receiver_pk"
                        :state="Boolean(deposit.receiver_pk)"
                        placeholder="Drop Receiver's Public Key"
                        drop-placeholder="Drop Public Key..."
                      >
                      </b-form-file>
                    </b-form-group>
                  </b-card>
                </b-container>
                <b-button type="submit">Submit</b-button>
              </b-form>
            </b-card-text>  
          </b-card>
        </b-col>
        <b-col>
          <b-card header-tag="header" footer-tag="footer">
            <template #header>
              <h4 class="mb-0">Withdraw</h4>
            </template>
            <b-card-text>
              <b-form @submit="onSubmitWithdraw">
                <b-container class="py-4 fluid">
                  <b-card>
                    <b-form-group
                      id="withdraw-receiver-pk-group"
                      label="Receiver's Public Key: "
                      label-for="withdraw-receiver-pk-input"
                      description="Public Key of the Receiver"
                      >
                        <b-form-file accept=".pem, .txt"
                          id="withdraw-receiver-pk-input"
                          v-model="withdraw.receiver_pk"
                          :state="Boolean(withdraw.receiver_pk)"
                          placeholder="Drop Receiver's Public Key"
                          drop-placeholder="Drop Public Key..."
                        >
                        </b-form-file>
                      </b-form-group>
                  </b-card>
                </b-container>
                <b-container class="py-4 fluid">
                  <b-card>
                    <b-form-group
                  id="withdraw-signature-group"
                  label="Signature: "
                  label-for="withdraw-signature-input"
                  description="Signature"
                  >
                    <b-form-file accept=".pem, .txt"
                      id="withdraw-signature-input"
                      v-model="withdraw.signature"
                      :state="Boolean(withdraw.signature)"
                      placeholder="Drop Signature"
                      drop-placeholder="Drop Signature..."
                    >
                    </b-form-file>
                  </b-form-group>
                  </b-card>
                </b-container>
                <b-container class="py-4 fluid">
                  <b-card>
                    <b-form-group
                      id="withdraw-group-group"
                      label="Public Key Group: "
                      label-for="withdraw-group-input"
                      description="Group of the Public Key"
                      >
                        <b-form-file accept=".pem, .txt"
                          id="withdraw-group-input"
                          v-model="withdraw.group"
                          :state="Boolean(withdraw.group)"
                          placeholder="Drop Public Key Group"
                          drop-placeholder="Drop Public Key Group..."
                        >
                      </b-form-file>
                    </b-form-group>
                  </b-card>
                </b-container>
                <b-button type="submit">Submit</b-button>
              </b-form>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
      </b-row>
    </b-container>
</template>

<script>
  // import VueMetamask from 'vue-metamask';

  export default {
    // components: {
    //   VueMetamask
    // },
    data () {
      return {
        deposit: {
          value: 0,
          receiver_pk: null,
          receiver_pk_text: null
        },
        withdraw: {
          receiver_pk: null,
          group: null,
          signature: null,
          receiver_pk_text: null,
          group_text: null,
          sign_file: null,
        }
      }
    },
    methods: {
      readFileAsync(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }, 

      async onSubmitDeposit(event) {
        event.preventDefault()
        console.log({
          "name": "deposit",
          "amount": this.deposit.value,
          "receiver_pk_file": this.deposit.receiver_pk
        })

        let file = this.deposit.receiver_pk;
        if (!file ) {
          console.log({
            "name": "deposit",
            "status": "ERR: No File Found"
          })
          return
        }

        let pkContent = await this.readFileAsync(file)
        this.deposit.receiver_pk_text = pkContent
        
        console.log({
          "name": "deposit",
          "status": "OK",
          "receiver_pk": this.deposit.receiver_pk_text,
          "amount": this.deposit.value,
          "next": "sending API POST request"
        })

        let response;

        try {
          response = await this.$http.post('https://pymixeth-server.herokuapp.com/api/add_address', {
            "key": this.deposit.receiver_pk_text,
            "amt": this.deposit.value
          })
        } catch (error) {
          response = {"err": error}
          console.log({
            "name": "withdraw",
            "status": "ERR: " + error.message
          })
        } finally {
          console.log(response)
        }
        console.log(response)
      },
      async onSubmitWithdraw(event) {
        event.preventDefault()
        console.log({
          "name": "withdraw",
          "receiver_pk_file": this.withdraw.receiver_pk,
          "group_file": this.withdraw.group,
          "sign_file": this.withdraw.signature
        })
        let pk_file = this.withdraw.receiver_pk;
        let group_file = this.withdraw.group;
        let sign_file = this.withdraw.signature;
        if (!pk_file || !group_file || !sign_file) {
          console.log({
            "name": "withdraw",
            "status": "ERR: No File Found"
          })
          return
        }
        
        let pkContent = await this.readFileAsync(pk_file)
        let groupContent = await this.readFileAsync(group_file)
        let signContent = await this.readFileAsync(sign_file)
        this.withdraw.receiver_pk_text = pkContent
        this.withdraw.group_text = groupContent
        this.withdraw.sign_text = signContent

        console.log({
          "name": "withdraw",
          "status": "OK",
          "receiver_pk": this.withdraw.receiver_pk_text,
          "group": this.withdraw.group_text,
          "sign": this.withdraw.sign_text,
          "next": "sending API POST request"
        })

        let response;

        try {
          response = await this.$http.post('https://pymixeth-server.com/api/withdraw', {
            "msg": this.withdraw.receiver_pk_text,
            "sign": this.withdraw.sign_text,
            "G_": this.withdraw.group_text
          })
        } catch (error) {
          response = {"err": error}
          console.log({
            "name": "withdraw",
            "status": "ERR: " + error.message
          })
        } finally {
          console.log(response)
        }
        console.log(response)
      }
    }
  }  
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
