import RoundIconButton from '@/common/components/buttons/round-icon-button';
import Section from '@/common/components/sections/section';
import SectionTitle from '@/common/components/sections/section-title';
import Page from '@/pages/page';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import { ComponentType, lazy, ReactNode, Suspense, useEffect, useMemo, useState } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PAGE = 'catalog';

// entry file loaders
const entryFiles = import.meta.glob('../../assets/catalog/week*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

// component file loaders
const componentFiles = import.meta.glob('../../**/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>;

type ParsedEntry = { body: string; componentPath: string; sourceUrl: string };

// parse entry for selected week into object
function parseEntry(raw: string): ParsedEntry {
  const bodyLines: string[] = [];
  let componentPath = '';
  let sourceUrl = '';
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
      if (line.trim()) sourceUrl = line.trim();
      continue;
    }
    bodyLines.push(line);
  }

  return { body: bodyLines.join('\n').trim(), componentPath, sourceUrl };
}

// loads component for selected week
function loadComponent(path: string): ComponentType | null {
  const loader = componentFiles[`../../${path}`];
  return loader ? lazy(loader) : null;
}

// maps section titles to component
const markdownComponentMap = {
  h3: ({ children }: { children?: ReactNode }) => (
    <SectionTitle variant='h5' message={String(children)} />
  ),
};

const Catalog = () => {
  const [week, setWeek] = useState<number>(1);
  const [entry, setEntry] = useState<ParsedEntry | null>(null);
  const [code, setCode] = useState<string>('');

  // load entry for selected week
  useEffect(() => {
    const loader = entryFiles[`../../assets/catalog/week${week}.md`];
    if (!loader) {
      setEntry(null);
      return;
    }
    // tracker for if user is still on this week, since loading entry is async
    let active = true;
    loader().then((raw) => {
      if (active) setEntry(parseEntry(raw));
    });
    // prevent race conditions from data from multiple weeks returning at once
    return () => {
      active = false;
    };
  }, [week]);

  // load code snippet for selected week
  useEffect(() => {
    if (!entry?.sourceUrl) {
      setCode('');
      return;
    }
    let active = true;
    fetch(entry.sourceUrl)
      .then((res) => res.text())
      .then((text) => {
        if (active) setCode(text);
      });
    return () => {
      active = false;
    };
  }, [entry?.sourceUrl]);

  const Component = useMemo(
    () => (entry?.componentPath ? loadComponent(entry.componentPath) : null),
    [entry?.componentPath],
  );

  function getWeekContent() {
    if (!entry) {
      return (
        <Section page={PAGE}>
          <SectionTitle message='Stay tuned for more components!' />
        </Section>
      );
    }
    return (
      <Section page={PAGE}>
        <Section style={{ width: '50%', minHeight: '200px', alignSelf: 'center' }}>
          {Component && (
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          )}
        </Section>
        <Markdown components={markdownComponentMap}>{entry.body}</Markdown>
        {code && (
          <SyntaxHighlighter language='tsx' style={oneDark}>
            {code}
          </SyntaxHighlighter>
        )}
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