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
  import detectEthereumProvider from '@metamask/detect-provider';
  import assert from 'assert';

  export default {

    data () {
      return {
        handlers: {
          provider: null,
          chainId: null
        },
        contractAddress: '0x14de78b0110812ea6c5287018785b3af313d7fc8',
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
      async loadMetamask() {
        this.handlers.provider = await detectEthereumProvider();
        this.handlers.chainId = await this.handlers.provider.request({
          method: 'eth_chainId',
        });
      },

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


        try {
          this.handlers.provider.isConnected()
        } catch {
          this.loadMetamask().then(() => {
            console.log("Handlers: ", this.handlers)
            console.log("ChainID: ", this.handlers.chainId)
          })
        }
        

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

  
        assert(this.handlers.provider.isConnected(), "Metamask not connected!")

        if (this.handlers.provider) {
          console.log("Requesting address")
          this.handlers.provider.request({
            method: 'eth_requestAccounts'
          })
        }

        console.log(this.handlers.provider)

        var params = 
          {
            from: this.handlers.provider.selectedAddress,
            to: '0x46FBBe1Dfe41442d36d64d1fBdEe540Ca140ba4D',
            value: this.deposit.value.toString(),
            chainId: '0x05',
          }

        this.handlers.provider.request({
          method: 'eth_sendTransaction',
          params: params
        }).then(result => {
          console.log({
            "name": "deposit",
            "status": "OK",
            "result": result,
            "next": "waiting for transaction to be mined"
          })
        }
        ).catch(error => {
          console.log({
            "name": "deposit",
            "status": "ERR",
            "error": error,
            "next": "waiting for transaction to be mined"
          }, params)
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



      },
      async onSubmitWithdraw(event) {
        event.preventDefault()

        try {
          this.handlers.provider.isConnected()
        } catch {
          this.loadMetamask().then(() => {
            console.log("Handlers: ", this.handlers)
          })
        }

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
          response = await this.$http.post('https://pymixeth-server.herokuapp.com/api/withdraw', {
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
