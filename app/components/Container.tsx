import { motion } from "framer-motion";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import BLOG from "#/blog.config";

const Container: React.FC<any> = ({
  children,
  title,
  layout,
  fullWidth,
  ...customMeta
}) => {
  const meta = {
    title: title || BLOG.title,
    type: "website",
    ...customMeta,
  };

  return (
    <div>
      <motion.div
        className={`wrapper ${
          BLOG.font === "serif" ? "font-serif" : "font-sans"
        }`}
        initial={{ opacity: 0, y: 10, scale: 1, translateZ: 0 }}
        animate={{ opacity: 1, y: 0, scale: 1, translateZ: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Header
          navBarTitle={layout === "blog" ? meta.title : null}
          fullWidth={fullWidth}
        />
        <motion.main
          className={`m-auto flex-grow w-full transition-all ${
            !fullWidth ? "max-w-[52rem] px-4 md:px-0" : "px-4 md:px-24"
          }`}
        >
          {children}
        </motion.main>
        <Footer fullWidth={fullWidth} />
      </motion.div>
    </div>
  );
};

export default Container;
