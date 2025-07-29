import axios from 'axios'
import type { Book } from '@/model/Book'

export async function searchBooksOpenLibrary(query: string): Promise<Book[]> {
  const response = await axios.get("https://openlibrary.org/search.json", {
    params: {
      q: query,
      limit: 20
    }
  })

  return response.data.docs.map((doc: any) => {
    // OLID získáme z klíče typu "/works/OLxxxxW"
    const olid = doc.key?.replace('/works/', '') || String(Date.now())

    return {
      id: olid,          // skutečné OLID z API, ne generované ID
      title: doc.title,
      author: doc.author_name?.[0] || 'Neznámý autor',
      year: doc.first_publish_year || 0,
      genre: doc.subject_facet?.[0]
        || doc.subject?.[0]
        || 'Unknown',
      coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : new URL('@/assets/no_poster.jpg', import.meta.url).href,
      external: true     // označíme, že je to kniha z externího API
    }
  })
}

export async function fetchBookDetailFromOpenLibrary(olid: string): Promise<Book> {
  const response = await fetch(`https://openlibrary.org/works/${olid}.json`)
  const data = await response.json()

  const title = data.title || 'Neznámý název'
  const author = data.authors?.[0]?.author?.key
    ? await fetchAuthorName(data.authors[0].author.key)
    : 'Neznámý autor'

  // Využití data.covers pro coverId
  const coverId = data.covers?.[0] || null
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : new URL('@/assets/no_poster.jpg', import.meta.url).href

  return {
    id: olid,
    title,
    author,
    year: data.first_publish_date ? parseInt(data.first_publish_date) : 0,
    genre: data.subjects?.[0] || 'Neznámý žánr',
    coverUrl,
    external: true
  }
}


async function fetchAuthorName(key: string): Promise<string> {
  const res = await fetch(`https://openlibrary.org${key}.json`)
  if (!res.ok) {
    return 'Neznámý autor'
  }
  const authorData = await res.json()
  return authorData.name || 'Neznámý autor'
}
