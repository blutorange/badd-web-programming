import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

interface FeatureItem {
	id: string;
	title: string;
	Svg: React.ComponentType<React.ComponentProps<"svg">>;
	description: ReactNode;
}

const FeatureList: FeatureItem[] = [
	{
		id: "zip-domain",
		title: "Did you know?",
		Svg: require("@site/static/img/brain.svg").default,
		description: (
			<>
				url.zip ist keine Datei, sondern die Adresse einer Webseite, welche
				URLs verkürzt? Google hatte vor einiger Zeit die *.zip-Top-Level-Domain<span> </span>
				<a target="_blank" rel="noreferrer" href="https://www.registry.google/tlds/zip/">eingeführt</a>.
				Was nicht <a href="https://en.wikipedia.org/wiki/.zip_(top-level_domain)#Security_concerns" target="_blank" rel="noreferrer">ohne Kontroversen blieb</a>.
			</>
		),
	},
	{
		id: "flash-emulator",
		title: "ruffle...",
		Svg: require("@site/static/img/ruffle.svg").default,
		description: (
			<>
				...ist ein Flash-Emulator, falls sich jemand nach den guten alten Zeiten
				des Webs zurücksehnt, wo Design noch mehr war als Graustufen.<span> </span>
				<a href="https://ruffle.rs/" target="_blank" rel="noreferrer">Verfügbar für alle gängigen Betriebssysteme.</a>
			</>
		),
	},
	{
		id: "powered-by-react",
		title: "Powered by React",
		Svg: require("@site/static/img/react.svg").default,
		description: (
			<>
				Auch diese Seite zur Webentwicklung nutzt moderne Web-Tools wie<span> </span>
				<a href="https://react.dev/" target="_blank" rel="noreferrer">React</a>.
			</>
		),
	},
];

function Feature({ title, Svg, description }: FeatureItem) {
	return (
		<div className={clsx("col col--4")}>
			<div className="text--center">
				<Svg className={styles.featureSvg} role="img" />
			</div>
			<div className="text--center padding-horiz--md">
				<Heading as="h3">{title}</Heading>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function HomepageFeatures(): ReactNode {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props) => (
						<Feature key={props.id} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
