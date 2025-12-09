import type { HTMLComparison } from '../types';

/**
 * Diverse test cases for HTML diff viewer
 * Covers various scenarios common in construction documentation
 */
export const testCases: HTMLComparison[] = [
  {
    name: 'Safety Equipment List',
    original: `<p>Safety equipment required:</p>
<ul>
  <li>Hard hat (Class G)</li>
  <li>Safety goggles</li>
  <li>Steel-toed boots</li>
</ul>`,
    modified: `<p>Safety equipment required:</p>
<ul>
  <li>Hard hat (Class E or G)</li>
  <li>Safety goggles (Anti-fog)</li>
  <li>High-visibility vest</li>
</ul>`,
  },

  {
    name: 'Installation Process',
    original: `<h2>Concrete Foundation Installation</h2>
<ol>
  <li>Prepare the excavation site</li>
  <li>Install formwork</li>
  <li>Pour concrete</li>
  <li>Wait 24 hours for initial cure</li>
</ol>
<p>Note: Ensure proper drainage before proceeding.</p>`,
    modified: `<h2>Concrete Foundation Installation</h2>
<ol>
  <li>Prepare and level the excavation site</li>
  <li>Install reinforcement mesh and formwork</li>
  <li>Pour concrete in 6-inch lifts</li>
  <li>Vibrate to remove air pockets</li>
  <li>Wait 48 hours for initial cure</li>
  <li>Apply curing compound</li>
</ol>
<p>Note: Ensure proper drainage and moisture barrier before proceeding.</p>`,
  },

  {
    name: 'Material Specifications',
    original: `<h3>Required Materials</h3>
<ul>
  <li>Concrete: Grade M25</li>
  <li>Steel reinforcement: Fe500</li>
</ul>`,
    modified: `<h3>Required Materials</h3>
<ul>
  <li>Concrete: Grade M30 (increased load capacity)</li>
  <li>Steel reinforcement: Fe550 (higher yield strength)</li>
  <li>Waterproofing membrane: 1.5mm HDPE</li>
  <li>Expansion joint filler: 20mm polyethylene foam</li>
</ul>
<p><strong>Supplier approval required for all materials.</strong></p>`,
  },

  {
    name: 'Simple Text Change',
    original: `<p>The contractor shall complete all foundation work by December 15th, 2024.</p>`,
    modified: `<p>The contractor shall complete all foundation work by January 30th, 2025.</p>`,
  },

  {
    name: 'Complete Section Addition',
    original: `<h2>Project Scope</h2>
<p>This project includes site preparation and foundation work.</p>`,
    modified: `<h2>Project Scope</h2>
<p>This project includes site preparation and foundation work.</p>

<h3>Environmental Considerations</h3>
<ul>
  <li>Erosion control measures required</li>
  <li>Stormwater management plan must be submitted</li>
  <li>Tree protection zones must be maintained</li>
  <li>Noise restrictions: 7am-6pm weekdays only</li>
</ul>

<h3>Safety Requirements</h3>
<p>All workers must complete site-specific safety orientation before beginning work.</p>`,
  },

  {
    name: 'Section Removal',
    original: `<h2>Temporary Structures</h2>
<p>The following temporary structures are required:</p>
<ul>
  <li>Site office trailer</li>
  <li>Worker rest area</li>
  <li>Material storage shed</li>
  <li>Temporary fencing</li>
</ul>

<h2>Permanent Structures</h2>
<p>Foundation work begins after temporary structures are in place.</p>`,
    modified: `<h2>Permanent Structures</h2>
<p>Foundation work begins after site preparation is complete.</p>`,
  },
];

export default testCases;

