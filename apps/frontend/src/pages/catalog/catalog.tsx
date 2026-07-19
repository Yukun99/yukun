import RoundIconButton from '@/common/components/buttons/round-icon-button';
import Section from '@/common/components/sections/section';
import SectionTitle from '@/common/components/sections/section-title';
import Page from '@/pages/page';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import { ComponentType, lazy, ReactNode, Suspense, useEffect, useMemo, useState } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PAGE = 'catalog';

// lazy entry file loaders
const entryFiles = import.meta.glob('../../assets/catalog/week*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

// lazy component file loaders
const componentFiles = import.meta.glob('../../**/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>;

type ParsedEntry = { body: string; componentPath: string; sourceUrls: string[] };

// parse entry for selected week into object
function parseEntry(raw: string): ParsedEntry {
  const bodyLines: string[] = [];
  let componentPath = '';
  let sourceUrls: string[] = [];
  let mode: 'body' | 'component' | 'source' = 'body';

  for (const line of raw.split('\n')) {
    const heading = line.match(/^###\s+(.*)/);
    if (heading) {
      const title = heading[1].trim().toLowerCase();
      if (title === 'component') {
        mode = 'component';
        continue;
      }
      if (title === 'source code') {
        mode = 'source';
        bodyLines.push(line);
        continue;
      }
      mode = 'body';
      bodyLines.push(line);
      continue;
    }
    if (mode === 'component') {
      if (line.trim()) componentPath = line.trim();
      continue;
    }
    if (mode === 'source') {
      if (line.trim()) sourceUrls.push(line.trim());
      continue;
    }
    bodyLines.push(line);
  }

  return { body: bodyLines.join('\n').trim(), componentPath, sourceUrls };
}

// loads component for selected week
function loadComponent(path: string): ComponentType | null {
  const loader = componentFiles[`${path}`];
  // uncomment below code to be sure of component path.
  // console.warn('Keys:', Object.keys(componentFiles));
  return loader ? lazy(loader) : null;
}

// maps section titles to component
const markdownComponentMap = {
  h3: ({ children }: { children?: ReactNode }) => (
    <SectionTitle variant='h5' message={String(children)} />
  ),
};

const Catalog = () => {
  const { mode } = useColorScheme();
  const [week, setWeek] = useState<number>(1);
  const [entry, setEntry] = useState<ParsedEntry | null>(null);
  const [code, setCode] = useState<string[]>([]);

  // load entry for selected week
  useEffect(() => {
    const loader = entryFiles[`../../assets/catalog/week${week}.md`];
    // reset code display to empty for next week
    setCode([]);
    if (!loader) {
      setEntry(null);
      return;
    }
    // tracker for if user is still on this week, since loading entry is async
    let active = true;
    loader().then((raw) => {
      if (active) setEntry(parseEntry(raw));
    });
    // prevent race conditions from multiple weeks returning data at once
    return () => {
      active = false;
    };
  }, [week]);

  // load code snippet for selected week
  useEffect(() => {
    if (!entry?.sourceUrls) return;
    let active = true;
    for (const sourceUrl of entry.sourceUrls) {
      fetch(sourceUrl)
        .then((res) => res.text())
        .then((text) => {
          if (active) {
            setCode((prev) => [...prev, text]);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [entry?.sourceUrls]);

  const Component = useMemo(
    () => (entry?.componentPath ? loadComponent(entry.componentPath) : null),
    [entry?.componentPath],
  );

  // get section containing content for the week
  function getWeekContent() {
    if (!entry) {
      return (
        <Section page={PAGE} centered>
          <SectionTitle variant='h5' message='Stay tuned for more components!' />
        </Section>
      );
    }
    return (
      <Section page={PAGE}>
        <Section
          blurless
          centered
          style={{ width: '60%', minHeight: '200px', alignSelf: 'center' }}
        >
          {Component && (
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          )}
        </Section>
        <Markdown components={markdownComponentMap}>{entry.body}</Markdown>
        {code
          && code.map((source, i) => (
            <SyntaxHighlighter language='tsx' style={mode === 'dark' ? oneDark : oneLight} key={i}>
              {source}
            </SyntaxHighlighter>
          ))}
      </Section>
    );
  }

  return (
    <Page>
      <Section page={PAGE} tight>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <RoundIconButton icon={ArrowBack} onClick={() => setWeek(week - 1)} />
          <SectionTitle message={`Week ${week}`} />
          <RoundIconButton icon={ArrowForward} onClick={() => setWeek(week + 1)} />
        </Box>
      </Section>
      {getWeekContent()}
    </Page>
  );
};

export default Catalog;