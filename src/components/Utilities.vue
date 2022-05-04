<template>
    <b-container class="my-4">
        <b-row>
            <b-col>
                <b-card header-tag="header">
                    <template #header>
                        <h4 class="mb-0">Private Key to Public Key (PEM)</h4>
                    </template>
                    <b-card-text>
                        <b-form @submit="onSubmitUtil">
                            <b-form-group
                                id="priv-k-2-pub-k-group"
                                label="Private Key: "
                                label-for="priv-k-2-pub-k-input"
                                description="Your Private Key Will Not Be Stored Anywhere"
                                >
                                <b-form-input
                                    id="priv-k-2-pub-k-input"
                                    v-model="util.priv_k"
                                    placeholder="Enter Private Key"
                                    type="password"
                                    required>
                                </b-form-input>
                            </b-form-group>
                            <b-button type="submit">Submit</b-button>
                        </b-form>
                    </b-card-text>
                </b-card>
                <b-card v-if="this.pem_pubk.show">
                    <b-card-text>
                        {{ this.pem_pubk.pub_k_pem }}
                    </b-card-text>
                </b-card>
            </b-col>
            <b-col>
                <b-card header-tag="header">
                    <template #header>
                        <h4 class="mb-0">Compute Shuffled Secret Key</h4>
                    </template>
                    <b-card-text>
                        <b-form @submit="onSubmitCompute">
                            <b-container class="py-4 fluid">
                                <b-form-group
                                    id="compute-priv-key-group"
                                    label="Private Key (PEM)"
                                    label-for="compute-priv-key-input"
                                    description="Private Key in PEM Format"
                                >
                                <b-form-file accept=".pem, .txt"
                                    id="compute-priv-key-input"
                                    v-model="compute.priv_k_file"
                                    :state="Boolean(compute.priv_k_file)"
                                    placeholder="Select Private Key"
                                    drop-placeholder="Drop Private Key Here"
                                ></b-form-file>
                                </b-form-group>
                            </b-container>
                            <b-container class="py-4 fluid">
                                <b-form-group
                                    id="compute-G_-group"
                                    label="G' (PEM)"
                                    label-for="compute-G_-input"
                                    description="G' in PEM Format"
                                >
                                <b-form-file accept=".pem, .txt"
                                    id="compute-G_-input"
                                    v-model="compute.G_file"
                                    :state="Boolean(compute.G_file)"
                                    placeholder="Select G'"
                                    drop-placeholder="Drop G' Here"
                                ></b-form-file>
                                </b-form-group>
                            </b-container>
                            <b-button type="submit">Submit</b-button>
                        </b-form>
                    </b-card-text>
                </b-card>
                <b-card v-if="this.compute.show">
                    <b-card-text>
                        {{ this.compute.pk_ }}
                    </b-card-text>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
const privateKeyToPublicKey = require('ethereum-private-key-to-public-key')
import KeyEncoder from 'key-encoder'
var keyEncoder = new KeyEncoder('secp256k1')
import axios from 'axios';

export default {
    name: 'Utilities',
    data() {
        return {
            util: {
                priv_k: '',
                pub_k: '',
            },
            pem_pubk: {
                show: false,
                pub_k_pem: null
            },
            compute: {
                priv_k_file: null,
                G_file: null,
                G_pem: null,
                priv_k_pem: null,
                pk_: null,
                show: false
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
            })
        },

        onSubmitUtil(event) {
            event.preventDefault()
            // console.log(this.util.priv_k)

            this.util.pub_k = privateKeyToPublicKey(this.util.priv_k).toString('hex')

            // console.log(this.util.pub_k)

            this.pem_pubk.pub_k_pem = keyEncoder.encodePublic(this.util.pub_k, 'raw', 'pem')

            // alert(this.util.pub_k_pem)
            this.pem_pubk.show = true
        },

        async onSubmitCompute(event) {
            event.preventDefault();

            console.log({
                priv_k_file: this.compute.priv_k_file,
                G_file: this.compute.G_file
            })

            let priv_k_pem = await this.readFileAsync(this.compute.priv_k_file);
            let G_pem = await this.readFileAsync(this.deposit.G_file);

            axios.post('https://pymixeth-server.herokuapp.com/api/get_shuffle', {
                sk: priv_k_pem,
                G_: G_pem
            })
            .then(response => {
                this.compute.pk_ = response.data.pk_;
                this.compute.show = true;
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
}
</script>

<style scoped>

</style>