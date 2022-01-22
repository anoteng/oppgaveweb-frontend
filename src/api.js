import axios from 'axios'
let accessToken = "AQXqOezlaKf2PXoo3G4PbKpcIPYzzC5NNVIyS5m9FmIDPTFJtXLNoqoDT5mgvaYN"
const client = axios.create({
    baseURL: 'https://org.ntnu.no/ibm/oppgaver-beta/api/index.php',
    json: true,
    headers: {
        'X-API-Key': accessToken,
    },
    withCredentials: true
})

export default {
    async execute (method, resource, data) {
        // inject the accessToken for each request
        // let accessToken = await Vue.prototype.$auth.getAccessToken()
        let accessToken = "AQXqOezlaKf2PXoo3G4PbKpcIPYzzC5NNVIyS5m9FmIDPTFJtXLNoqoDT5mgvaYN"
        return client({
            method,
            url: resource,
            data,
            headers: {
                'X-API-Key': accessToken,
            }
        }).then(req => {
            // console.log(req)
            return req.data.records
        })
    },
    get(endpoint, options){
        const promise = new Promise((resolve) => {
            resolve(this.execute('get', '/records/' + endpoint + '?' + options))
        })
      return promise
    },
    put(endpoint, data){
        return this.execute('post', '/records/' + endpoint, data)
    },
    update(endpoint, id, data){
        return this.execute('put', '/records/' + endpoint + '/' + id, data)
    },
    getSemesters () {
        return this.execute('get', '/records/termin')
    },
    getPosts () {
        return this.execute('get', '/api/species')
    },
    getPost (id) {
        return this.execute('get', `/api/species/${id}`)
    },
    createPost (data) {
        return this.execute('post', '/api/species', data)
    },
    updatePost (id, data) {
        return this.execute('put', `/api/species/${id}`, data)
    },
    deletePost (id) {
        return this.execute('delete', `/api/species/${id}`)
    }
}