let btn_pt_1 = document.getElementById("btn_pt_1")
let btn_pt_2 = document.getElementById("btn_pt_2")
let btn_pt_3 = document.getElementById("btn_pt_3")
let btn_pt_4 = document.getElementById("btn_pt_4")
let btn_sfe_1 = document.getElementById("btn_sfe_1")
let btn_sfe_2 = document.getElementById("btn_sfe_2")
let btn_cce_1 = document.getElementById("btn_cce_1")
let btn_logoff = document.getElementById("btn_logoff")





btn_logoff.addEventListener("click",()=>{ document.cookie = "accessToken" + '=; Max-Age=0', window.location.replace(window.location.origin + "/login/Acreditacion")})

// SE REDIRIGE A PAGINA 3014 DE TRANSFERENCIAS
btn_sfe_1.addEventListener("click", ()=>{
    location.replace("http://10.56.99.21:3014/consultaVUL")
})
btn_sfe_2.addEventListener("click", ()=>{
    location.replace("http://10.56.99.21:3014/transferVUL")
})
btn_cce_1.addEventListener("click", ()=>{
    location.replace("http://10.56.99.21:3014/conteo_ciclico/VUL")
})