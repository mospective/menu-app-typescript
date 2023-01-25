import { createClient } from 'contentful';
import Image from "next/image";
import Header from '../../components/Header';
import { formatPrice } from '../../helpers';
import styles from "../../styles/Menu.module.css";

const menuCategories: string[] = ["mains", "sides", "drinks"];

export const getStaticPaths = async () => {
    const paths = menuCategories.map(cat => {
        return {
            params: { cat }
        }
    })

    return {
        paths: paths,
        fallback: false
    }
};

interface paramsProp {
    params: { cat: string; };
}

export async function getStaticProps(context: paramsProp) {
    
  const type: string = context.params.cat;
    
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY
  })

  const res = await client.getEntries({ content_type: type });

  return {
    props: {
        menuItems: res.items
    }
  }
}

interface itemsProp {
        fields: { 
            foodName: any; 
            drinkName: any; 
            description: string; 
            price: number; 
            foodImage: { 
                fields: { 
                    file: any;
                };
             };
         };
};

const Category = ({ menuItems }) => {
    return (
        <>
            <Header />
            <div className={styles.cards}>
                 {menuItems.map(({fields}: itemsProp, i: number) => {
                    const productName: string = fields.foodName || fields.drinkName;
                    const description: string = fields?.description;
                    const price: number = fields.price;
                    const imageInfo = fields?.foodImage?.fields.file;
                    const image: string = imageInfo?.url;

                    return (
                        <div className={styles.card} key={i}>
                            <div className={image ? styles.text : styles.fullwidth}>
                                <p className={styles.product}>{ productName }</p>
                                <p className={styles.description}>{ description }</p>
                                <span className={styles.price}>{ formatPrice(price) }</span>
                            </div>
                            {image && (
                                <div className={styles.image}>
                                    <Image src={`https:${image ? image : "none"}`} alt={productName} width={imageInfo?.details.image.width} height={imageInfo?.details.image.height}/>
                                </div>
                            )}
                        </div>
                        );
                })}
            </div>
        
        </>
    );
};

export default Category;