function displayProduct(camCard) {
    const camCard = document.getElementById("#camCard")
    const affichDetails = document.importNode(camCard.content, true)

    affichDetails.getElementById("name").textContent = article.title
    affichDetails.getElementById("price").textContent = article.body
    affichDetails.getElementById("description").href += "?id=" + article.id

  document.getElementById("main").appendChild(affichDetails)
}