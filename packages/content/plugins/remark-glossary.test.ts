import { compile } from "@mdx-js/mdx"
import type { Root } from "mdast"
import type { MdxJsxAttribute, MdxJsxTextElement } from "mdast-util-mdx-jsx"
import type { Node, Parent } from "unist"
import type { Plugin } from "unified"
import { describe, expect, it } from "vitest"

import {
  glossary as productionGlossary,
  type Glossary,
  type Locale,
} from "../glossary"
import { remarkGlossary, type RemarkGlossaryOptions } from "./remark-glossary"

const fixtureGlossary = {
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
    def: { en: "Code that runs close to the visitor." },
    mode: "tooltip",
  },
  velite: {
    match: {
      en: ["Velite"],
      fi: ["Velite", "Veliten", "Velitellä"],
      "pt-br": ["Velite"],
    },
    def: { en: "A tool that turns Markdown into typed data." },
    mode: "tooltip",
  },
  "english-only": {
    match: { en: ["build time"] },
    def: { en: "The moment when source files become an application." },
    mode: "tooltip",
  },
  "empty-alias": {
    match: { en: [""] },
    def: { en: "An invalid alias that must be ignored." },
    mode: "tooltip",
  },
} satisfies Glossary

const approvedGlossaryEntries = {
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
} satisfies Glossary

type LocaleOption = RemarkGlossaryOptions["locale"]

async function transform(
  source: string,
  locale: LocaleOption = "en",
  path = "projects/example/en.mdx",
  glossary: Glossary = fixtureGlossary
): Promise<Root> {
  let transformed: Root | undefined

  const captureTree: Plugin<[], Root> = () => (tree) => {
    transformed = structuredClone(tree)
  }

  await compile(
    { value: source, path },
    {
      remarkPlugins: [[remarkGlossary, { glossary, locale }], captureTree],
    }
  )

  if (!transformed) throw new Error("Remark pipeline did not produce an AST")
  return transformed
}

function descendants(tree: Node): Node[] {
  const nodes = [tree]

  if ("children" in tree) {
    for (const child of (tree as Parent).children) {
      nodes.push(...descendants(child))
    }
  }

  return nodes
}

function attribute(node: MdxJsxTextElement, name: string): string {
  const value = node.attributes.find(
    (item): item is MdxJsxAttribute =>
      item.type === "mdxJsxAttribute" && item.name === name
  )?.value

  return typeof value === "string" ? value : ""
}

function glossaryMarks(tree: Node): Array<{ id: string; term: string }> {
  return descendants(tree)
    .filter(
      (node): node is MdxJsxTextElement =>
        node.type === "mdxJsxTextElement" &&
        "name" in node &&
        node.name === "GlossaryTerm"
    )
    .map((node) => ({
      id: attribute(node, "id"),
      term: attribute(node, "term"),
    }))
}

function plainText(tree: Root): string {
  return descendants(tree)
    .filter((node) => node.type === "text")
    .map((node) => ("value" in node ? String(node.value) : ""))
    .join("")
}

describe("remarkGlossary", () => {
  it("leaves prose unchanged when no locale variant matches", async () => {
    const tree = await transform("Nothing in this sentence needs a glossary.")

    expect(glossaryMarks(tree)).toEqual([])
    expect(plainText(tree)).toBe("Nothing in this sentence needs a glossary.")
  })

  it("does not fall back to English matching for a missing locale", async () => {
    const tree = await transform("This happens at build time.", "fi")

    expect(glossaryMarks(tree)).toEqual([])
    expect(plainText(tree)).toContain("build time")
  })

  it("wraps a term that occupies the entire text node", async () => {
    const tree = await transform("Velite")

    expect(glossaryMarks(tree)).toEqual([{ id: "velite", term: "Velite" }])
    expect(descendants(tree).filter((node) => node.type === "text")).toEqual([])
  })

  it("recognizes Finnish inflections as their stable glossary ids", async () => {
    const tree = await transform(
      "Cloudflare Workerissa toimii Veliten sisältö. Velitellä on muitakin ominaisuuksia.",
      "fi"
    )

    expect(glossaryMarks(tree)).toEqual([
      { id: "cloudflare-worker", term: "Cloudflare Workerissa" },
      { id: "velite", term: "Veliten" },
    ])
    expect(plainText(tree)).toContain("Velitellä")
  })

  it("resolves the locale from the MDX VFile", async () => {
    const localeFromPath = ({ path }: { path?: string }): Locale =>
      path?.endsWith("/fi.mdx") ? "fi" : "en"
    const tree = await transform(
      "Velitellä sisältö muuttuu dataksi.",
      localeFromPath,
      "projects/example/fi.mdx"
    )

    expect(glossaryMarks(tree)).toEqual([{ id: "velite", term: "Velitellä" }])
  })

  it("wraps only the first alias of each concept per page", async () => {
    const tree = await transform(
      "Cloudflare Worker receives data. Cloudflare Workers process more data. Velite builds content."
    )

    expect(glossaryMarks(tree)).toEqual([
      { id: "cloudflare-worker", term: "Cloudflare Worker" },
      { id: "velite", term: "Velite" },
    ])
    expect(plainText(tree)).toContain("Cloudflare Workers process more data")
  })

  it("does not match inline code or fenced code blocks", async () => {
    const tree = await transform(
      [
        "`Velite` is shown as code. Velite is prose.",
        "",
        "```ts",
        'const tool = "Velite"',
        "```",
      ].join("\n")
    )

    expect(glossaryMarks(tree)).toEqual([{ id: "velite", term: "Velite" }])
    expect(
      descendants(tree).filter((node) => node.type === "inlineCode")
    ).toHaveLength(1)
    expect(
      descendants(tree).filter((node) => node.type === "code")
    ).toHaveLength(1)
  })

  it("does not match inside an existing link", async () => {
    const tree = await transform(
      "[Velite](https://velite.js.org) is linked. Velite is prose."
    )

    expect(glossaryMarks(tree)).toEqual([{ id: "velite", term: "Velite" }])
    const link = descendants(tree).find((node) => node.type === "link")
    expect(link).toBeDefined()
    expect(glossaryMarks(link!)).toEqual([])
  })

  it("does not match inside existing JSX", async () => {
    const tree = await transform("<span>Velite</span>\n\nVelite is prose.")

    expect(glossaryMarks(tree)).toEqual([{ id: "velite", term: "Velite" }])
    const jsx = descendants(tree).find(
      (node) =>
        (node.type === "mdxJsxTextElement" ||
          node.type === "mdxJsxFlowElement") &&
        "name" in node &&
        node.name === "span"
    )
    expect(jsx).toBeDefined()
    expect(glossaryMarks(jsx!)).toEqual([])
  })

  it("uses exact case, whole-token boundaries, and longest alias priority", async () => {
    const tree = await transform(
      "VeliteConfig and velite stay plain. Velite matches. Cloudflare Workers run."
    )

    expect(glossaryMarks(tree)).toEqual([
      { id: "velite", term: "Velite" },
      { id: "cloudflare-worker", term: "Cloudflare Workers" },
    ])
    expect(plainText(tree)).toContain("VeliteConfig and velite stay plain")
  })
})

describe("approved glossary entries", () => {
  it("keeps the approved localized aliases and definitions", () => {
    for (const [id, entry] of Object.entries(approvedGlossaryEntries)) {
      expect(productionGlossary[id]).toEqual(entry)
    }
  })

  for (const [id, entry] of Object.entries(approvedGlossaryEntries)) {
    for (const [locale, aliases] of Object.entries(entry.match)) {
      for (const alias of aliases) {
        it(`marks ${id} from the ${locale} alias ${alias}`, async () => {
          const tree = await transform(
            `Before ${alias} after.`,
            locale as Locale,
            `projects/example/${locale}.mdx`,
            productionGlossary
          )

          expect(glossaryMarks(tree)).toEqual([{ id, term: alias }])
        })
      }
    }
  }
})
