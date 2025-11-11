import Layout from "@/components/Layout"
import Nav from "@/components/Nav"

export const SearchPage = () => {
  return (
    <div>
      <Layout>
        <Nav />
      </Layout>
      <Layout>
        <h2 className="font-profile-header lg:text-4xl font-medium sm:text-2xl text-white text-center mt-10 w-full flex items-center justify-center">
          {
            <span className="text-balance w-full sm:w-2/3 xl:w-1/2">
              Discover, Review &amp; Book Trusted Tattoo Artists
            </span>
          }
        </h2>
      </Layout>
    </div>
  )
}
