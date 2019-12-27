(function () {
    const BASE_URL = 'https://movie-list.alphacamp.io'
    const INDEX_URL = BASE_URL + '/api/v1/movies/'
    const POSTER_URL = BASE_URL + '/posters/'
    const data = []
    const genreList = document.getElementById('genre-list')
    const dataPanel = document.getElementById('data-panel')
    const ITEM_PER_PAGE = 12
    let paginationData = []
    const genres = {
        "1": "Action",
        "2": "Adventure",
        "3": "Animation",
        "4": "Comedy",
        "5": "Crime",
        "6": "Documentary",
        "7": "Drama",
        "8": "Family",
        "9": "Fantasy",
        "10": "History",
        "11": "Horror",
        "12": "Music",
        "13": "Mystery",
        "14": "Romance",
        "15": "Science Fiction",
        "16": "TV Movie",
        "17": "Thriller",
        "18": "War",
        "19": "Western"
    }
    axios.get(INDEX_URL).then((response) => {
      data.push(...response.data.results)
      displayGenreList (data)
      //getTotalPages(data)
      //getPageData(1, data)
      addGenreListener()
      addPaginationListener()
      $(`#genre-list li:nth-child(1) a`).tab('show')
    }).catch((err) => console.log(err))

    
    // listen to genre click event in movie card
    function addGenreListener() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', event => {
                if (event.target.classList.contains('genre-in-card')) {
                    const order = Number(event.target.dataset.genre)
                    $(`#genre-list li:nth-child(${order}) a`).tab('show')
                }    
            })
        })
    }

    function paginationActive(event, genreId) {
        document.getElementById(`pagination-genre-${genreId}`).querySelectorAll('li').forEach(li => {
            li.classList.remove('active')
        })
        event.target.parentElement.classList.add('active')
    }

    function addPaginationListener() {
        dataPanel.querySelectorAll('.pagination').forEach(pagination => {
            pagination.addEventListener('click', event => {
                if (event.target.tagName === 'A') {
                    const genreId = Number(event.target.parentElement.parentElement.dataset.pagination)
                    const movieInGenre = data.filter(movie => movie.genres.includes(genreId))
                    document.getElementById(`movies-row-${genreId}`).innerHTML = getPageData(Number(event.target.dataset.page), movieInGenre)
                    document.getElementById(`movies-row-${genreId}`).querySelectorAll('.card').forEach(card => {
                        card.addEventListener('click', event => {
                            if (event.target.classList.contains('genre-in-card')) {
                                const order = Number(event.target.dataset.genre)
                                $(`#genre-list li:nth-child(${order}) a`).tab('show')
                            }    
                        })
                    })
                    paginationActive(event, genreId)
                }
            })
        })
    }
    
    
    
    
    function getTotalPages (data) {
      let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
      let pageItemContent = `
                    <ul class="pagination justify-content-center">
                            <li class="page-item active">
                                <a class="page-link" href="javascript:;" data-page="1">1</a>
                            </li>`
                    for (let i = 1; i < totalPages; i++) {
                            pageItemContent += `
                            <li class="page-item">
                                <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
                            </li>
                            `
                        }
          pageItemContent += `
                    </ul>`
      return pageItemContent
    }
   
  
    function getPageData (pageNum, data) {
      paginationData = data || paginationData
      let offset = (pageNum - 1) * ITEM_PER_PAGE
      let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
      let htmlContent = displayDataList(pageData)
      return htmlContent
    }


    function displayGenreList (data) {
        Object.keys(genres).forEach(key => {
            //左邊列表
            const li = document.createElement('li')
            li.innerHTML = `<a class="nav-link" data-toggle="pill" href="#v-pills-${key}">${genres[key]}</a>`
            genreList.appendChild(li)
            //右方卡片
            const movies = document.createElement('div')
            movies.classList.add('tab-pane', 'fade')
            movies.id = `v-pills-${key}`
            //該類別資料
            const movieInGenre = data.filter(movie => movie.genres.includes(Number(key)))
            const moviesRow = document.createElement('div')
            moviesRow.classList.add('row')
            moviesRow.id = `movies-row-${key}`
            if (movieInGenre.length > 0) {
                moviesRow.innerHTML = getPageData(1, movieInGenre)
                movies.appendChild(moviesRow)
                const pagination = document.createElement('nav')
                pagination.innerHTML = getTotalPages(movieInGenre)
                movies.appendChild(pagination)
                movies.querySelector('.pagination').dataset.pagination = key
                movies.querySelector('.pagination').id = `pagination-genre-${key}`
            } else {
                moviesRow.innerHTML = '<h2>There is no movie in this genre</h2>'
                movies.appendChild(moviesRow)
            }
            dataPanel.appendChild(movies)
        }) 
    }

    function displayDataList (data) {
      let htmlContent = ''
      data.forEach(function (item, index) {
        htmlContent += `
          <div class="col-sm-3">
            <div class="card mb-2">
              <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
              <div class="card-body movie-item-body">
                <h6 class="card-title">${item.title}</h5>
                <div class="card-content">`
                    item.genres.forEach(key => {
                        htmlContent += `
                        <div class="btn btn-light genre-in-card" data-genre="${key}">
                            ${genres[key]}
                        </div>`
                    })
        htmlContent += `
                </div>
              </div>
            </div>
          </div>
        `    
      })
      return htmlContent
    }
  })()