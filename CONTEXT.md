# course-ngoprekonline

An Indonesian-language online course site. This context covers the site's content surfaces, starting with the blog.

## Language

**Blog Post**:
A piece of published blog content, written in Indonesian and reachable at a stable URL. It supports prose, images, code blocks, and video embeds.
_Avoid_: Article, entry, blog entry

**Tag**:
A free-form topic label attached to a Blog Post, used to group posts into archive pages. Tags are many-per-post and secondary to a post's Category.
_Avoid_: Category, label

**Category**:
The single curated primary grouping of a Blog Post, chosen from a small managed list. A post has exactly one Category; Categories give the blog stable browsing entry points. A Category's identity is permanent, while its display name and description may be edited freely, and Categories do not nest.
_Avoid_: Label, topic, section

**Draft**:
A Blog Post that is not yet visible on the public site. Drafts may be previewed during development.
_Avoid_: Unpublished post, WIP

**Publish**:
To make a Blog Post visible on the public site. Publishing is a content decision, not a deployment.
_Avoid_: Deploy, release

**Resource**:
A downloadable file attached to a Blog Post (template, cheat sheet, code, asset). Either local, living in the repository's public downloads area with a declared size that must match the real file, or external, a direct file URL on a PPD host opened by redirect in a new tab.
_Avoid_: Attachment, asset, file package

**PPD**:
Pay Per Download: the file-hosting model used for external Resources (e.g. Rapidgator). Links may expire and cannot be bundled or re-served by the site.
_Avoid_: file host, cloud storage, drive

**Paket**:
The site's packaging of a Blog Post: its article plus every attached Resource, presented as one downloadable unit. Shown as the Spec Plate on the article page and, when a post ships two or more local Resources, a single on-demand ZIP ("Unduh semua") at `/downloads/<post-slug>.zip` bundling only those local ones.
_Avoid_: article package, bundle, archive

**Content Management**:
The authoring workflow for blog content. Content is owned by the repository rather than a database: it is written as files, edited directly or through a self-hosted visual editor, and published as part of a deployment.
_Avoid_: CMS, admin panel, back office
