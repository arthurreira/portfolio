export const GLOSSARY_LOCALES = ["en", "fi", "pt-br"] as const

export type Locale = (typeof GLOSSARY_LOCALES)[number]

export type GlossaryMode = "tooltip" | "link"

export type GlossaryEntry = {
  match: Partial<Record<Locale, string[]>>
  def: Partial<Record<Locale, string>>
  mode: GlossaryMode
  href?: string
}

export type Glossary = Record<string, GlossaryEntry>

/** Keys are stable concept ids; visible aliases and definitions are localized. */
export const glossary: Glossary = {
  "cloudflare-worker": {
    match: {
      en: ["Cloudflare Worker", "Cloudflare Workers"],
      fi: [
        "Cloudflare Worker",
        "Cloudflare Workerissa",
        "Cloudflare Workers",
        "Cloudflare Workersilla",
        "Cloudflare Workersin",
      ],
      "pt-br": ["Cloudflare Worker", "Cloudflare Workers"],
    },
    def: {
      en: "A small piece of code that runs close to the visitor instead of on one central server.",
      fi: "Pieni koodinpätkä, joka pyörii lähellä kävijää yhden keskuspalvelimen sijaan.",
      "pt-br":
        "Um pequeno trecho de código que roda perto do visitante em vez de em um único servidor central.",
    },
    mode: "tooltip",
  },
  velite: {
    match: {
      en: ["Velite"],
      fi: ["Velite", "Veliten", "Velitellä"],
      "pt-br": ["Velite"],
    },
    def: {
      en: "A tool that turns Markdown project files into typed data a website can display.",
      fi: "Työkalu, joka muuttaa Markdown-projektitiedostot tyypitetyksi dataksi, jota sivusto voi näyttää.",
      "pt-br":
        "Uma ferramenta que transforma arquivos de projeto em Markdown em dados tipados que o site pode exibir.",
    },
    mode: "tooltip",
  },
  "semantic-search": {
    match: {
      en: ["semantic search"],
      fi: ["semanttista hakua", "semanttinen haku"],
      "pt-br": ["busca semântica", "recuperação semântica"],
    },
    def: {
      en: "finds traffic data by the meaning of a question rather than only matching identical words",
      fi: "löytää liikennedataa kysymyksen merkityksen perusteella eikä vain samoja sanoja vertaamalla",
      "pt-br":
        "encontra dados de tráfego pelo significado da pergunta, não apenas pela correspondência de palavras iguais",
    },
    mode: "tooltip",
  },
  "multi-tenant-saas": {
    match: {
      en: ["multi-tenant SaaS", "multi-tenant", "multi-tenancy"],
      fi: ["moniasiakkaisena SaaS-palveluna", "moniasiakasjärjestelmä"],
      "pt-br": ["SaaS multi-tenant", "multi-tenant", "multi-tenancy"],
    },
    def: {
      en: "one service supports multiple organizations without mixing one organization's data with another's",
      fi: "moniasiakkainen SaaS-palvelu palvelee useita organisaatioita samassa palvelussa ja pitää jokaisen organisaation tiedot erillään",
      "pt-br":
        "um único serviço atende várias organizações sem misturar os dados de uma com os de outra",
    },
    mode: "tooltip",
  },
  "event-ingestion": {
    match: {
      en: ["event ingestion"],
      fi: ["tapahtumien vastaanotto", "tapahtumien vastaanoton"],
      "pt-br": ["ingestão de eventos"],
    },
    def: {
      en: "receives page views, sessions, and custom events from websites and sends them into the analytics system",
      fi: "ottaa sivustoilta vastaan sivulataukset, istunnot ja mukautetut tapahtumat ja välittää ne analytiikkajärjestelmään",
      "pt-br":
        "recebe visualizações de página, sessões e eventos personalizados dos sites e os encaminha para o sistema de analytics",
    },
    mode: "tooltip",
  },
  "vector-store": {
    match: {
      en: ["vector store"],
      fi: ["vektorivarastoa", "vektorivarasto"],
      "pt-br": ["vector store"],
    },
    def: {
      en: "stores numeric versions of content so the chat can find passages related to a question — an approach Arthur deliberately did not build here",
      fi: "säilyttää sisällöstä tehtyjä numeroesityksiä, jotta chat voi löytää kysymykseen liittyvät tekstikohdat — ratkaisu, jota Arthur ei tietoisesti rakentanut tähän",
      "pt-br":
        "guarda versões numéricas do conteúdo para o chat encontrar trechos relacionados à pergunta — uma abordagem que Arthur decidiu não usar aqui",
    },
    mode: "tooltip",
  },
  "embedding-pipeline": {
    match: {
      en: ["embedding pipeline"],
      fi: ["Embedding-putken", "Embedding-putki"],
      "pt-br": ["pipeline de embeddings"],
    },
    def: {
      en: "turns portfolio content into numbers that let the chat find passages related to a question — a rejected alternative, not part of the current architecture",
      fi: "muuttaa portfolion sisällön numeroesityksiksi, joiden avulla chat voi löytää kysymykseen liittyvät tekstikohdat — hylätty vaihtoehto, ei osa nykyistä arkkitehtuuria",
      "pt-br":
        "transforma o conteúdo do portfolio em números que permitem ao chat encontrar trechos relacionados à pergunta — uma alternativa rejeitada, não faz parte da arquitetura atual",
    },
    mode: "tooltip",
  },
  "per-ip-rate-limit": {
    match: {
      en: ["per-IP rate limit"],
      fi: ["IP-kohtainen nopeusrajoitus"],
      "pt-br": ["rate limit por IP"],
    },
    def: {
      en: "limits how often one internet address can use the chat, stopping repeated abuse before it costs money",
      fi: "rajoittaa sitä, kuinka usein yhdestä IP-osoitteesta voi käyttää chatia, jotta toistuva väärinkäyttö pysähtyy ennen kulujen syntymistä",
      "pt-br":
        "limita a frequência com que um mesmo endereço de internet pode usar o chat, barrando abuso repetido antes que gere custo",
    },
    mode: "tooltip",
  },
  "server-components": {
    match: {
      en: ["Server Components"],
      fi: ["Server Componentit"],
      "pt-br": ["Server Components"],
    },
    def: {
      en: "build parts of the dashboard on the server and fetch their data without sending that work to the browser",
      fi: "muodostavat osan koontinäytöstä palvelimella ja hakevat tiedot siirtämättä tätä työtä selaimeen",
      "pt-br":
        "montam partes do dashboard no servidor e buscam os dados sem transferir esse trabalho ao navegador",
    },
    mode: "tooltip",
  },
}
