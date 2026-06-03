-- ============================================================
-- Silences Ordinaires — Données de test
-- À exécuter APRÈS supabase_schema.sql dans le SQL Editor
-- ============================================================

-- Post 1
insert into posts (title, slug, content, excerpt, cover_url, category, published, created_at)
values (
  'La fenêtre du quatrième',
  'la-fenetre-du-quatrieme',
  '<h2>I.</h2>
<p>Il y a des matins où la lumière entre différemment. Pas plus forte, pas plus dorée — juste différente. Elle longe le mur du fond, frôle le cadre de la photo de mariage sans s''y arrêter, puis glisse sur le parquet comme si elle cherchait quelque chose qu''elle n''avait jamais trouvé là.</p>
<p>Depuis sa fenêtre du quatrième, Madame Yomba regardait la cour intérieure. Vingt-deux ans dans cet immeuble, et elle n''avait jamais appris le prénom du jardinier. Il venait le mardi. Il repartait en laissant les géraniums un peu moins en désordre. C''était tout ce qu''elle savait de lui.</p>
<h2>II.</h2>
<p>Elle avait déménagé ici pour se rapprocher de sa fille. Trois kilomètres — au lieu de huit cent cinquante. Sa fille habitait en bas de la rue, travaillait beaucoup, appelait le dimanche soir, parfois le samedi. C''était le contrat tacite de l''amour adulte : être là sans peser, proche sans s''imposer, présente sans déranger.</p>
<p>La fenêtre du quatrième était devenue son poste d''observation. Elle y voyait tout : les disputes du couple du deuxième qui croyaient avoir baissé la voix, les retours tardifs du jeune homme du premier avec ses valises de voyage, les livraisons du mardi pour l''appartement du rez-de-chaussée — des boîtes de médicaments, toujours.</p>
<p>Elle voyait tout. Elle ne disait rien. C''est peut-être ça, la solitude qui ne se remarque pas : quand on devient spectateur de sa propre vie.</p>',
  'Depuis la fenêtre du quatrième étage, on voit tout. Et tout ce qu''on voit finit par peser.',
  'https://picsum.photos/seed/fenetre4/1600/900',
  'Chroniques',
  true,
  now() - interval '3 days'
) on conflict (slug) do nothing;

-- Post 2
insert into posts (title, slug, content, excerpt, cover_url, category, published, created_at)
values (
  'Ce que l''on tait aux dîners de famille',
  'ce-que-l-on-tait-aux-diners-de-famille',
  '<p>Il y a une question qu''on ne pose jamais aux dîners de famille. Pas parce qu''elle est interdite — personne ne l''a interdite. Simplement parce qu''on a appris, enfant, que certaines questions rendent les adultes mal à l''aise. Et un enfant qui rend l''atmosphère lourde gâche le repas. Alors on apprend à ne pas demander.</p>
<p>Plus tard, quand on est adulte soi-même et qu''on s''assoit à cette même table, on réalise qu''on a oublié quelle était cette question. On l''a tellement enfouie qu''elle a perdu sa forme. Elle n''est plus qu''un malaise vague, un inconfort sans nom, une sensation de ne pas tout à fait être là — même quand on rit avec tout le monde.</p>
<blockquote>C''est une forme de solitude particulièrement cruelle : celle qu''on ressent entouré de sa propre famille.</blockquote>
<p>On l''appelle parfois l''isolement affectif. On pourrait aussi l''appeler la loyauté au silence. Parce que se taire, dans certaines familles, c''est une façon d''aimer — ou du moins de ne pas blesser. Et on ne sait plus très bien où finit la protection et où commence la solitude.</p>',
  'Il y a une question qu''on ne pose jamais aux dîners de famille. Plus tard, on réalise qu''on a oublié laquelle.',
  'https://picsum.photos/seed/diners/1600/900',
  'Réflexions',
  true,
  now() - interval '10 days'
) on conflict (slug) do nothing;
