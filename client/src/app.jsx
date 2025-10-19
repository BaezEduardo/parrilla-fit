import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import Section from "./components/Section";

export default function App() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/menu")
      .then(r => r.json())
      .then(setMenu)
      .catch(() => setError("No se pudo cargar el menú"));
  }, []);

  if (error) return <div className="container error">{error}</div>;
  if (!menu) return <div className="container">Cargando…</div>;

  return (
    <>
      <Hero title={menu.hero.title} 
            subtitle={menu.hero.subtitle}
            image={menu.hero.image}
      />
       {/*Franja “Nuestro Menú” */}
      <section className="menu-intro">
        <div className="container">
          <h2 className="menu-intro__title">Nuestro Menú</h2>
          <p className="menu-intro__subtitle">
            Descubre nuestros platos especiales elaborados con los mejores ingredientes y
            pasión por la excelencia culinaria
          </p>
        </div>
      </section>

      <main id="menu" className="container">
        {menu.sections.map((s, i) => (
          <Section key={i} name={s.name} items={s.items} />
        ))}
        <p className="helper">¿Necesitas ayuda para elegir? Chatea con nuestro asistente.</p>
      </main>
    </>
  );
}
