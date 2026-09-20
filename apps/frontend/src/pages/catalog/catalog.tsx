import RoundIconButton from '@/common/components/buttons/round-icon-button';
import Reveal from '@/common/components/effects/reveal';
import Section from '@/common/components/sections/section';
import SectionTitle from '@/common/components/sections/section-title';
import SkeletonSection from '@/common/skeletons/sk-section';
import { PAGE } from '@/pages/catalog/utils/page';
import Page from '@/pages/page';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import useResolvedMode from '@/common/hooks/use-resolved-mode';
import { ComponentType, lazy, ReactNode, Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// lazy entry file loaders
const entryFiles = import.meta.glob('../../assets/catalog/week*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

// lazy component file loaders
const componentFiles = import.meta.glob('./components/week*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>;

// lazy source text loaders, keyed from the project root so entries can name any file under src
const sourceFiles = import.meta.glob('/src/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

// one step past the last entry, so the coming soon card stays reachable
const LAST_WEEK = Object.keys(entryFiles).length + 1;

type ParsedEntry = { body: string; componentPath: string; sourcePaths: string[] };

// parse entry for selected week into object
function parseEntry(raw: string): ParsedEntry {
  const bodyLines: string[] = [];
  let componentPath = '';
  const sourcePaths: string[] = [];
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
      if (line.trim()) sourcePaths.push(line.trim());
      continue;
    }
    bodyLines.push(line);
  }

  return { body: bodyLines.join('\n').trim(), componentPath, sourcePaths };
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
  const { t } = useTranslation(PAGE);
  const mode = useResolvedMode();
  const [week, setWeek] = useState<number>(1);
  const [entry, setEntry] = useState<ParsedEntry | null>(null);
  const [code, setCode] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // load entry for selected week
  useEffect(() => {
    const loader = entryFiles[`../../assets/catalog/week${week}.md`];
    // reset code display to empty for next week
    setCode([]);
    setEntry(null);
    setLoading(Boolean(loader));
    if (!loader) return;
    // tracker for if user is still on this week, since loading entry is async
    let active = true;
    loader().then((raw) => {
      if (active) {
        setEntry(parseEntry(raw));
        setLoading(false);
      }
    });
    // prevent race conditions from multiple weeks returning data at once
    return () => {
      active = false;
    };
  }, [week]);

  // load code snippet for selected week
  useEffect(() => {
    if (!entry?.sourcePaths) return;
    let active = true;
    const loadSource = (sourcePath: string) =>
      sourceFiles[`/src/${sourcePath}`]?.().catch(() => null) ?? Promise.resolve(null);
    Promise.all(entry.sourcePaths.map(loadSource)).then((sources) => {
      if (active) setCode(sources.filter((source) => source !== null));
    });
    return () => {
      active = false;
    };
  }, [entry?.sourcePaths]);

  const Component = useMemo(
    () => (entry?.componentPath ? loadComponent(entry.componentPath) : null),
    [entry?.componentPath],
  );

  // get section containing content for the week
  function getWeekContent() {
    if (!entry && !loading) {
      return (
        <Section page={PAGE} centered>
          <SectionTitle variant='h5' message={t('comingSoon')} />
        </Section>
      );
    }

    return (
      <Section page={PAGE}>
        <SkeletonSection minHeight={200} style={{ width: '60%', alignSelf: 'center' }}>
          {Component && (
            <Suspense key={week} fallback={null}>
              <Section blurless centered reveal='mount' style={{ minHeight: '200px' }}>
                <Component />
              </Section>
            </Suspense>
          )}
        </SkeletonSection>
        {entry && (
          <Reveal trigger='mount' delay={250}>
            <Markdown components={markdownComponentMap}>{entry.body}</Markdown>
          </Reveal>
        )}
        {code
          && code.map((source, i) => (
            <Reveal trigger='mount' delay={(i + 1) * 250} key={i}>
              <SyntaxHighlighter language='tsx' style={mode === 'dark' ? oneDark : oneLight}>
                {source}
              </SyntaxHighlighter>
            </Reveal>
          ))}
      </Section>
    );
  }

  return (
    <Page>
      <Section page={PAGE} tight>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <RoundIconButton
            icon={ArrowBack}
            onClick={() => {
              if (week > 1) setWeek(week - 1);
            }}
            disabled={week === 1}
          />
          <SectionTitle message={t('week', { week })} />
          <RoundIconButton
            icon={ArrowForward}
            onClick={() => {
              if (week < LAST_WEEK) setWeek(week + 1);
            }}
            disabled={week === LAST_WEEK}
          />
        </Box>
      </Section>
      {getWeekContent()}
    </Page>
  );
};

export default Catalog;