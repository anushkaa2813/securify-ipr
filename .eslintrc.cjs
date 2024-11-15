<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Securify IPR</title>
    <style>
      /* Basic Reset */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
      }

      body {
        background-color: #f9f9f9;
        color: #333;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      /* Navbar */
      nav {
        background-color: #4CAF50;
        color: #fff;
        padding: 1rem;
        text-align: center;
      }

      nav h1 {
        font-size: 1.8rem;
      }

      nav ul {
        list-style: none;
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin-top: 0.5rem;
      }

      nav ul li a {
        color: #fff;
        text-decoration: none;
        font-weight: bold;
      }

      nav ul li a:hover {
        text-decoration: underline;
      }

      /* Main Content */
      #root {
        flex: 1;
        padding: 2rem;
        max-width: 800px;
        margin: auto;
      }

      .hero-section {
        text-align: center;
        margin-bottom: 2rem;
      }

      .hero-section h2 {
        font-size: 2rem;
        color: #4CAF50;
      }

      .hero-section p {
        color: #666;
        margin-top: 1rem;
        line-height: 1.6;
      }

      /* Footer */
      footer {
        background-color: #333;
        color: #fff;
        padding: 1rem;
        text-align: center;
      }

      footer p {
        font-size: 0.9rem;
      }

    </style>
  </head>
  <body>
    <!-- Navbar -->
    <nav>
      <h1>Securify IPR</h1>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>

    <!-- Main Content Area -->
    <div id="root">
      <section class="hero-section">
        <h2>Protect Your Intellectual Property</h2>
        <p>Welcome to Securify IPR, your trusted platform for securing and managing intellectual property rights. Protect your creations, prevent unauthorized usage, and ensure peace of mind with our innovative solutions.</p>
      </section>
    </div>

    <!-- Footer -->
    <footer>
      <p>&copy; 2024 Securify IPR. All rights reserved.</p>
    </footer>

    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
