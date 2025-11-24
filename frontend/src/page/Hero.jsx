import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="min-h-screen w-full flex flex-col justify-center items-center text-center px-6 bg-background">
      <h1 className="text-5xl sm:text-6xl md:text-7xl text-balance text-foreground font-extrabold tracking-tight">
        <span className="text-primary">Transform</span> Every Link Into a Story.
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-muted-foreground text-center">
        Turn messy URLs into meaningful insights with{" "}
        <span className="text-primary font-semibold">LinkFlow</span>
      </p>

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        {/* Primary button */}
        <Link to="/register">
          <button className="bg-primary text-primary-foreground rounded-lg font-medium px-6 py-3 hover:bg-primary/80 transition-all">
            Get Started
          </button>
        </Link>

        {/* Secondary button */}
        <Link to="/login">
          <button className="bg-muted text-muted-foreground border border-border rounded-lg font-medium px-6 py-3 hover:bg-accent hover:text-accent-foreground transition-all">
            Login
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
