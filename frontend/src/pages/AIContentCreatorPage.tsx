import React, { useState } from 'react';
import { PenTool, Copy, Download, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { callAI } from '../utils/aiClient';
import { getSalesConfig } from '../utils/salesConfig';

interface ContentSections {
  seoBlog: string;
  socialCaptions: string;
  linkedinPost: string;
  instagramCarousel: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-teal/10 transition-colors" title="Copy"
      style={{ color: copied ? '#4ade80' : 'rgba(232,245,244,0.4)' }}>
      {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
    </button>
  );
}

export function AIContentCreatorPage() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentSections | null>(null);
  const [error, setError] = useState('');

  const config = getSalesConfig();
  const isConfigured = config.apiEndpoint && config.apiKey && config.apiEndpointEnabled && config.apiKeyEnabled;

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError('');
    setContent(null);

    try {
      const prompt = `You are an expert content creator for a digital agency. Generate comprehensive content for the keyword/topic: "${keyword}"

Please provide ALL of the following sections, clearly labeled:

## SEO BLOG POST
Write a complete SEO-optimized blog post (800-1000 words) with title, introduction, 3-4 sections with subheadings, and conclusion.

## SOCIAL MEDIA CAPTIONS
Write 5 engaging social media captions (Instagram/Facebook/Twitter) with relevant hashtags.

## LINKEDIN POST
Write a professional LinkedIn post (200-300 words) that provides value and drives engagement.

## INSTAGRAM CAROUSEL
Create an outline for a 5-slide Instagram carousel with slide titles and key points for each slide.`;

      const result = await callAI('AI Content Creator', [
        { role: 'system', content: 'You are an expert content creator and digital marketing specialist for Quick Bee AI Growth Engine.' },
        { role: 'user', content: prompt },
      ], 2500);

      const sections = parseContent(result);
      setContent(sections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const parseContent = (raw: string): ContentSections => {
    const extract = (marker: string, nextMarker?: string) => {
      const start = raw.indexOf(marker);
      if (start === -1) return '';
      const contentStart = start + marker.length;
      const end = nextMarker ? raw.indexOf(nextMarker, contentStart) : raw.length;
      return raw.slice(contentStart, end === -1 ? raw.length : end).trim();
    };

    return {
      seoBlog: extract('## SEO BLOG POST', '## SOCIAL MEDIA CAPTIONS') || raw.slice(0, raw.length / 4),
      socialCaptions: extract('## SOCIAL MEDIA CAPTIONS', '## LINKEDIN POST') || '',
      linkedinPost: extract('## LINKEDIN POST', '## INSTAGRAM CAROUSEL') || '',
      instagramCarousel: extract('## INSTAGRAM CAROUSEL') || '',
    };
  };

  const handleExportAll = () => {
    if (!content) return;
    const text = `AI CONTENT CREATOR — Quick Bee AI Growth Engine
Keyword: ${keyword}
Generated: ${new Date().toLocaleString()}
${'='.repeat(60)}

SEO BLOG POST
${'='.repeat(60)}
${content.seoBlog}

SOCIAL MEDIA CAPTIONS
${'='.repeat(60)}
${content.socialCaptions}

LINKEDIN POST
${'='.repeat(60)}
${content.linkedinPost}

INSTAGRAM CAROUSEL
${'='.repeat(60)}
${content.instagramCarousel}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${keyword.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyle = { background: 'rgba(0,180,166,0.05)', borderColor: 'rgba(0,180,166,0.2)', color: '#e8f5f4' };

  const sections = content ? [
    { key: 'seoBlog', label: 'SEO Blog Post', text: content.seoBlog },
    { key: 'socialCaptions', label: 'Social Media Captions', text: content.socialCaptions },
    { key: 'linkedinPost', label: 'LinkedIn Post', text: content.linkedinPost },
    { key: 'instagramCarousel', label: 'Instagram Carousel Outline', text: content.instagramCarousel },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <PenTool size={32} style={{ color: '#00d4c8' }} />
          <div>
            <h1 className="page-title">AI Content Creator</h1>
            <p className="page-subtitle">Generate SEO blogs, social captions, LinkedIn posts & Instagram carousels</p>
          </div>
        </div>
      </div>

      {!isConfigured && (
        <div className="flex items-center gap-2 p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertTriangle size={16} style={{ color: '#fbbf24' }} />
          <span className="text-sm" style={{ color: '#fbbf24' }}>
            API not configured. <Link to="/settings" className="underline font-semibold">Configure in Sales Settings →</Link>
          </span>
        </div>
      )}

      <div className="glass-card rounded-xl p-5">
        <Label className="text-white/70 text-sm mb-2 block">Keyword / Topic</Label>
        <div className="flex gap-3">
          <Input
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="e.g. AI automation for small businesses, Digital marketing trends 2026"
            style={inputStyle}
            className="flex-1"
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          />
          <Button onClick={handleGenerate} disabled={loading || !isConfigured || !keyword.trim()} className="btn-teal whitespace-nowrap">
            {loading ? <><Loader2 size={14} className="mr-2 animate-spin" /> Generating...</> : 'Generate Content'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="glass-card rounded-xl p-12 text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: '#00d4c8' }} />
          <p className="text-sm" style={{ color: 'rgba(232,245,244,0.5)' }}>Generating content for "{keyword}"...</p>
        </div>
      )}

      {content && !loading && (
        <>
          <div className="flex justify-end">
            <Button onClick={handleExportAll} variant="ghost" className="border border-teal/20 text-white/60 hover:text-teal" style={{ borderColor: 'rgba(0,180,166,0.2)' }}>
              <Download size={16} className="mr-2" /> Export All
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {sections.map(({ key, label, text }) => (
              <div key={key} className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{label}</h3>
                  <CopyButton text={text} />
                </div>
                <div className="text-xs whitespace-pre-wrap max-h-64 overflow-y-auto scrollbar-thin" style={{ color: 'rgba(232,245,244,0.7)', lineHeight: '1.6' }}>
                  {text || 'No content generated for this section.'}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
